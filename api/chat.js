const { streamText, tool, stepCountIs } = require('ai');
const { google } = require('@ai-sdk/google');
const { z } = require('zod');
const db = require('../db-connection');
const { SYSTEM_PROMPT } = require('./schema-context');
const { catalog, catalogPrompt } = require('./catalog');

const MODEL_NAME = 'gemini-3-flash-preview';
const MAX_ROWS = 50;

// Get component schemas from catalog
const chartSchema = catalog.components.ChartCard.props;
const tableSchema = catalog.components.DataTable.props;

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
            throw new Error('Only SELECT queries are allowed');
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
        const query = createQueryFunction();
        const asyncFunction = new Function('query', `
            return (async () => {
                ${code}
            })();
        `);

        const result = await asyncFunction(query);

        console.log('[Code] Execution successful');

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

function normalizeData(data) {
    if (!Array.isArray(data)) return [];
    return data.slice(0, MAX_ROWS);
}

function createChartPatches(blockId, chartSpec) {
    const chartKey = `chart_${blockId}`;
    const safeData = normalizeData(chartSpec.data);

    const element = {
        key: chartKey,
        type: 'ChartCard',
        props: {
            ...chartSpec,
            data: safeData
        }
    };

    return [
        { op: 'set', path: '/root', value: chartKey },
        { op: 'set', path: `/elements/${chartKey}`, value: element }
    ];
}

function createTablePatches(blockId, tableSpec) {
    const tableKey = `table_${blockId}`;
    const safeData = normalizeData(tableSpec.data);
    const maxRows = tableSpec.maxRows || 10;

    const element = {
        key: tableKey,
        type: 'DataTable',
        props: {
            ...tableSpec,
            data: safeData.slice(0, maxRows)
        }
    };

    return [
        { op: 'set', path: '/root', value: tableKey },
        { op: 'set', path: `/elements/${tableKey}`, value: element }
    ];
}

async function runChat({ message, history, onText, onUi }) {
    const tools = {
        runCode: tool({
            description: 'Execute JavaScript code to query and analyze the HR database. Use query(sql) for SELECT-only queries.',
            inputSchema: z.object({
                code: z.string(),
                explanation: z.string().optional()
            }),
            execute: async ({ code, explanation }) => runCode(code, explanation)
        }),
        describeTable: tool({
            description: 'Get the column names and types for a specific table.',
            inputSchema: z.object({
                tableName: z.string()
            }),
            execute: async ({ tableName }) => describeTable(tableName)
        }),
        renderChart: tool({
            description: 'Emit a chart UI block for visualizing data. Use for trends, distributions, comparisons.',
            inputSchema: chartSchema,
            execute: async (params) => {
                const blockId = `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
                const patches = createChartPatches(blockId, params);
                if (onUi) {
                    for (const patch of patches) {
                        onUi({ blockId, patch });
                    }
                }
                return { success: true, blockId };
            }
        }),
        renderTable: tool({
            description: 'Emit a data table UI block for displaying tabular data. Use for lists, records, detailed results.',
            inputSchema: tableSchema,
            execute: async (params) => {
                const blockId = `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
                const patches = createTablePatches(blockId, params);
                if (onUi) {
                    for (const patch of patches) {
                        onUi({ blockId, patch });
                    }
                }
                return { success: true, blockId };
            }
        })
    };

    const messages = (history || []).map(msg => ({
        role: msg.role === 'assistant' ? 'assistant' : 'user',
        content: msg.content
    }));

    messages.push({ role: 'user', content: message });

    console.log('[runChat] Calling streamText with model:', MODEL_NAME);
    console.log('[runChat] API key present:', !!process.env.GOOGLE_GENERATIVE_AI_API_KEY);

    try {
        // Combine HR context with json-render catalog prompt
        const fullSystemPrompt = `${SYSTEM_PROMPT}\n\n## UI Components\n${catalogPrompt}\n\nWhen showing structured data, prefer using renderTable. When showing trends or distributions, use renderChart.`;

        const result = streamText({
            model: google(MODEL_NAME),
            system: fullSystemPrompt,
            messages,
            tools,
            stopWhen: stepCountIs(10)
        });

        console.log('[runChat] streamText returned, iterating fullStream...');

        let chunkCount = 0;
        for await (const part of result.fullStream) {
            console.log('[runChat] Part type:', part.type, 'Full part:', JSON.stringify(part, null, 0));
            if (part.type === 'text-delta') {
                chunkCount++;
                const textValue = part.text; // AI SDK v6 uses 'text' not 'textDelta'
                console.log('[runChat] Text delta value:', JSON.stringify(textValue), 'type:', typeof textValue);
                onText?.(textValue);
            } else if (part.type === 'tool-call') {
                console.log('[runChat] Tool call:', part.toolName);
            } else if (part.type === 'tool-result') {
                console.log('[runChat] Tool result for:', part.toolName);
            } else if (part.type === 'error') {
                console.error('[runChat] Stream error:', part.error);
            }
        }

        console.log('[runChat] Stream finished, total text chunks:', chunkCount);
    } catch (err) {
        console.error('[runChat] Error during streaming:', err);
        throw err;
    }
}

function createStreamWriter(res) {
    return (payload) => {
        res.write(`${JSON.stringify(payload)}\n`);
    };
}

async function stream(req, res) {
    console.log('[stream] Received request');
    const { message, history = [] } = req.body || {};

    if (!message || typeof message !== 'string') {
        console.log('[stream] Missing message');
        return res.status(400).json({
            success: false,
            error: 'Message is required'
        });
    }

    console.log('[stream] Message:', message.slice(0, 50));

    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Accel-Buffering', 'no');
    res.flushHeaders?.();

    const write = createStreamWriter(res);

    try {
        console.log('[stream] Starting runChat');
        await runChat({
            message,
            history,
            onText: (text) => {
                console.log('[stream] Text chunk:', text?.slice?.(0, 30) ?? '(empty)');
                if (text) write({ type: 'text', value: text });
            },
            onUi: ({ blockId, patch }) => {
                console.log('[stream] UI patch for', blockId);
                write({ type: 'ui', blockId, patch });
            }
        });

        console.log('[stream] Done');
        write({ type: 'done' });
        res.end();
    } catch (error) {
        console.error('[stream] Error:', error);
        const message = error instanceof Error ? error.message : 'Failed to stream response';
        write({ type: 'error', message });
        res.end();
    }
}

/**
 * Non-streaming chat handler (kept for compatibility)
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

        let responseText = '';

        await runChat({
            message,
            history,
            onText: (text) => {
                responseText += text;
            }
        });

        res.json({
            success: true,
            response: responseText
        });
    } catch (error) {
        console.error('[Chat] Error:', error.message);
        res.status(500).json({
            success: false,
            error: 'Failed to process chat message',
            details: error.message
        });
    }
}

module.exports = {
    chat,
    stream
};
