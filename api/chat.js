const { GoogleGenerativeAI } = require('@google/generative-ai');
const db = require('../db-connection');
const { SYSTEM_PROMPT } = require('./schema-context');

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Tool definitions for function calling
const tools = [
    {
        functionDeclarations: [
            {
                name: "executeQuery",
                description: "Execute a SELECT SQL query against the HR database and return the results. Only SELECT queries are allowed.",
                parameters: {
                    type: "object",
                    properties: {
                        sql: {
                            type: "string",
                            description: "The SQL SELECT query to execute"
                        }
                    },
                    required: ["sql"]
                }
            },
            {
                name: "describeTable",
                description: "Get the column names and types for a specific table",
                parameters: {
                    type: "object",
                    properties: {
                        tableName: {
                            type: "string",
                            description: "The name of the table to describe"
                        }
                    },
                    required: ["tableName"]
                }
            }
        ]
    }
];

/**
 * Validate that a query is SELECT-only (safety check)
 */
function isSelectOnly(sql) {
    const normalized = sql.trim().toUpperCase();
    const forbidden = ['INSERT', 'UPDATE', 'DELETE', 'DROP', 'CREATE', 'ALTER', 'TRUNCATE', 'GRANT', 'REVOKE'];

    // Must start with SELECT or WITH (for CTEs)
    if (!normalized.startsWith('SELECT') && !normalized.startsWith('WITH')) {
        return false;
    }

    // Check for forbidden keywords
    for (const keyword of forbidden) {
        if (normalized.includes(keyword)) {
            return false;
        }
    }

    return true;
}

/**
 * Execute a SQL query (SELECT only)
 */
async function executeQuery(sql) {
    if (!isSelectOnly(sql)) {
        return { error: "Only SELECT queries are allowed. Cannot modify data." };
    }

    try {
        // Add LIMIT if not present to prevent huge result sets
        const normalizedSql = sql.trim();
        const hasLimit = normalizedSql.toUpperCase().includes('LIMIT');
        const safeSql = hasLimit ? normalizedSql : `${normalizedSql} LIMIT 100`;

        const [rows] = await db.pool.query(safeSql);
        return {
            success: true,
            rowCount: rows.length,
            data: rows
        };
    } catch (error) {
        return { error: `Query failed: ${error.message}` };
    }
}

/**
 * Describe a table's structure
 */
async function describeTable(tableName) {
    try {
        // Sanitize table name to prevent injection
        const safeName = tableName.replace(/[^a-zA-Z0-9_]/g, '');
        const [rows] = await db.pool.query(`DESCRIBE ${safeName}`);
        return {
            success: true,
            table: safeName,
            columns: rows.map(r => ({
                name: r.Field,
                type: r.Type,
                nullable: r.Null === 'YES',
                key: r.Key,
                default: r.Default
            }))
        };
    } catch (error) {
        return { error: `Could not describe table: ${error.message}` };
    }
}

/**
 * Process a tool call from Gemini
 */
async function handleToolCall(functionCall) {
    const { name, args } = functionCall;

    switch (name) {
        case 'executeQuery':
            return await executeQuery(args.sql);
        case 'describeTable':
            return await describeTable(args.tableName);
        default:
            return { error: `Unknown tool: ${name}` };
    }
}

/**
 * Main chat handler
 */
async function chat(req, res) {
    try {
        const { message, history = [] } = req.body;

        if (!message || typeof message !== 'string') {
            return res.status(400).json({
                success: false,
                error: 'Message is required'
            });
        }

        // Initialize model with tools
        const model = genAI.getGenerativeModel({
            model: "gemini-3-flash-preview",
            tools: tools,
            systemInstruction: SYSTEM_PROMPT
        });

        // Build chat history - Gemini uses 'model' instead of 'assistant'
        const chatHistory = history.map(msg => ({
            role: msg.role === 'assistant' ? 'model' : msg.role,
            parts: [{ text: msg.content }]
        }));

        // Start chat session
        const chatSession = model.startChat({
            history: chatHistory
        });

        // Send user message
        let response = await chatSession.sendMessage(message);
        let result = response.response;

        // Handle tool calls in a loop (AI might need multiple tool calls)
        while (result.candidates[0]?.content?.parts?.some(part => part.functionCall)) {
            const toolCalls = result.candidates[0].content.parts.filter(part => part.functionCall);
            const toolResults = [];

            for (const part of toolCalls) {
                const functionCall = part.functionCall;

                // Log the SQL query clearly
                if (functionCall.name === 'executeQuery') {
                    console.log('\n┌─────────────────────────────────────');
                    console.log('│ 🤖 AI Generated SQL:');
                    console.log('├─────────────────────────────────────');
                    console.log('│ ' + functionCall.args.sql.replace(/\n/g, '\n│ '));
                    console.log('└─────────────────────────────────────\n');
                } else {
                    console.log(`[Chat] Tool call: ${functionCall.name}`, functionCall.args);
                }

                const toolResult = await handleToolCall(functionCall);
                console.log(`[Chat] Result: ${toolResult.error || `${toolResult.rowCount || toolResult.columns?.length || 0} rows returned`}`);

                toolResults.push({
                    functionResponse: {
                        name: functionCall.name,
                        response: toolResult
                    }
                });
            }

            // Send tool results back to Gemini
            response = await chatSession.sendMessage(toolResults);
            result = response.response;
        }

        // Extract final text response
        const textResponse = result.candidates[0]?.content?.parts
            ?.filter(part => part.text)
            ?.map(part => part.text)
            ?.join('\n') || 'I could not generate a response.';

        res.json({
            success: true,
            response: textResponse
        });

    } catch (error) {
        console.error('[Chat] Error:', error.message);
        console.error('[Chat] Full error:', JSON.stringify(error, null, 2));
        res.status(500).json({
            success: false,
            error: 'Failed to process chat message',
            details: error.message
        });
    }
}

module.exports = {
    chat
};
