const { GoogleGenerativeAI } = require('@google/generative-ai');
const db = require('../db-connection');
const { SYSTEM_PROMPT } = require('./schema-context');

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Tool definition for programmatic tool calling - AI writes code
const tools = [
    {
        functionDeclarations: [
            {
                name: "runCode",
                description: `Execute JavaScript code to query and analyze the HR database. 
                The code has access to an async 'query(sql)' function that executes SELECT queries and returns an array of rows.
                The code should return the final result that will be shown to the user.
                Use this for complex queries, data transformations, or when you need to combine multiple queries.`,
                parameters: {
                    type: "object",
                    properties: {
                        code: {
                            type: "string",
                            description: "JavaScript code to execute. Must return a value. Has access to: query(sql) for database queries."
                        },
                        explanation: {
                            type: "string",
                            description: "Brief explanation of what the code does"
                        }
                    },
                    required: ["code"]
                }
            },
            {
                name: "describeTable",
                description: "Get the column names and types for a specific table. Use this first if unsure about table structure.",
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
    const forbidden = ['INSERT', 'UPDATE', 'DELETE', 'DROP', 'CREATE', 'ALTER', 'TRUNCATE', 'GRANT', 'REVOKE', 'EXEC', 'EXECUTE'];

    if (!normalized.startsWith('SELECT') && !normalized.startsWith('WITH')) {
        return false;
    }

    for (const keyword of forbidden) {
        if (normalized.includes(keyword)) {
            return false;
        }
    }

    return true;
}

/**
 * Create the query function that will be available in the executed code
 */
function createQueryFunction() {
    return async function query(sql) {
        if (!isSelectOnly(sql)) {
            throw new Error("Only SELECT queries are allowed");
        }

        const normalizedSql = sql.trim();
        const hasLimit = normalizedSql.toUpperCase().includes('LIMIT');
        const safeSql = hasLimit ? normalizedSql : `${normalizedSql} LIMIT 100`;

        const [rows] = await db.pool.query(safeSql);
        return rows;
    };
}

/**
 * Execute AI-generated JavaScript code in a controlled environment
 */
async function runCode(code, explanation) {
    console.log('\n┌─────────────────────────────────────');
    console.log('│ 🤖 AI Generated Code:');
    if (explanation) {
        console.log(`│ 📝 ${explanation}`);
    }
    console.log('├─────────────────────────────────────');
    console.log('│ ' + code.replace(/\n/g, '\n│ '));
    console.log('└─────────────────────────────────────\n');

    try {
        // Create the query function
        const query = createQueryFunction();

        // Wrap the code in an async function and execute it
        // The code has access to 'query' function
        const asyncFunction = new Function('query', `
            return (async () => {
                ${code}
            })();
        `);

        const result = await asyncFunction(query);

        console.log(`[Code] Execution successful`);

        return {
            success: true,
            result: result
        };
    } catch (error) {
        console.error(`[Code] Execution error: ${error.message}`);
        return {
            error: `Code execution failed: ${error.message}`
        };
    }
}

/**
 * Describe a table's structure
 */
async function describeTable(tableName) {
    try {
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
        case 'runCode':
            return await runCode(args.code, args.explanation);
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

        // Handle tool calls in a loop
        while (result.candidates[0]?.content?.parts?.some(part => part.functionCall)) {
            const toolCalls = result.candidates[0].content.parts.filter(part => part.functionCall);
            const toolResults = [];

            for (const part of toolCalls) {
                const functionCall = part.functionCall;
                const toolResult = await handleToolCall(functionCall);

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
