const { streamText, tool, stepCountIs } = require('ai');
const { google } = require('@ai-sdk/google');
const { z } = require('zod');
const db = require('../db-connection');
const { SYSTEM_PROMPT } = require('./schema-context');
const { catalog, catalogPrompt } = require('./catalog');
const { createRunCode } = require('./ai/db-tools');

const MODEL_NAME = 'gemini-3-flash-preview';
const MAX_ROWS = 50;
const runCode = createRunCode({ defaultLimit: 100 });

// Get component schemas from catalog
const chartSchema = catalog.components.ChartCard.props;
const tableSchema = catalog.components.DataTable.props;
const actionCardSchema = catalog.components.ActionCard.props;

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

function createActionPatches(blockId, actionSpec) {
    const actionKey = `action_${blockId}`;

    const element = {
        key: actionKey,
        type: 'ActionCard',
        props: {
            title: actionSpec.title,
            description: actionSpec.description,
            actionId: actionSpec.actionId,
            fields: actionSpec.fields || []
        }
    };

    return [
        { op: 'set', path: '/root', value: actionKey },
        { op: 'set', path: `/elements/${actionKey}`, value: element }
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
        }),
        proposeAction: tool({
            description: 'Propose a database modification to the user. Use when user asks to update, create, or delete records. Renders an editable form for user approval.',
            inputSchema: actionCardSchema,
            execute: async (params) => {
                const blockId = `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
                const patches = createActionPatches(blockId, params);
                if (onUi) {
                    for (const patch of patches) {
                        onUi({ blockId, patch });
                    }
                }
                return { success: true, blockId, message: 'Action form rendered. Waiting for user approval.' };
            }
        })
    };

    const messages = (history || []).map(msg => ({
        role: msg.role === 'assistant' ? 'assistant' : 'user',
        content: msg.content
    }));

    messages.push({ role: 'user', content: message });

    console.log('\n' + '='.repeat(60));
    console.log('🤖 CHAT REQUEST');
    console.log('='.repeat(60));
    console.log('Model:', MODEL_NAME);
    console.log('Message:', message.slice(0, 100) + (message.length > 100 ? '...' : ''));
    console.log('History length:', history.length, 'messages');
    console.log('-'.repeat(60));

    try {
        // Combine HR context (includes proposeAction rules) with json-render catalog prompt
        const fullSystemPrompt = `${SYSTEM_PROMPT}\n\n## UI Components\n${catalogPrompt}\n\nWhen showing structured data, prefer using renderTable. When showing trends or distributions, use renderChart. When user asks to modify/update/create/delete data, use proposeAction to show an approval form.\n\nIMPORTANT: Always render results visually using these tools—never output raw code or data arrays as text.`;

        console.log('📝 SYSTEM PROMPT (first 500 chars):');
        console.log(fullSystemPrompt.slice(0, 500) + '...');
        console.log('-'.repeat(60));

        const result = streamText({
            model: google(MODEL_NAME),
            system: fullSystemPrompt,
            messages,
            tools,
            stopWhen: stepCountIs(10)
        });

        console.log('⏳ Streaming response...');
        console.log('-'.repeat(60));

        let textChunks = 0;
        let toolCalls = [];
        let totalText = '';

        for await (const part of result.fullStream) {
            if (part.type === 'text-delta') {
                textChunks++;
                totalText += part.text || '';
                onText?.(part.text);
            } else if (part.type === 'tool-call') {
                toolCalls.push(part.toolName);
                console.log(`🔧 Tool call: ${part.toolName}`);
            } else if (part.type === 'tool-result') {
                console.log(`✅ Tool result: ${part.toolName}`);
            } else if (part.type === 'finish') {
                console.log('-'.repeat(60));
                console.log('📊 TOKEN USAGE:');
                console.log(`   Input:  ${part.totalUsage?.inputTokens || 'N/A'}`);
                console.log(`   Output: ${part.totalUsage?.outputTokens || 'N/A'}`);
                console.log(`   Total:  ${part.totalUsage?.totalTokens || 'N/A'}`);
                if (part.totalUsage?.cachedInputTokens) {
                    console.log(`   Cached: ${part.totalUsage.cachedInputTokens}`);
                }
            } else if (part.type === 'error') {
                console.error('❌ Stream error:', part.error);
            }
        }

        console.log('-'.repeat(60));
        console.log('📤 RESPONSE SUMMARY:');
        console.log(`   Text chunks: ${textChunks}`);
        console.log(`   Tool calls: ${toolCalls.length > 0 ? toolCalls.join(', ') : 'none'}`);
        console.log(`   Response preview: ${totalText.slice(0, 150)}${totalText.length > 150 ? '...' : ''}`);
        console.log('='.repeat(60) + '\n');

    } catch (err) {
        console.error('❌ Error during streaming:', err.message);
        console.log('='.repeat(60) + '\n');
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
        const errorMessage = error instanceof Error ? error.message : 'Failed to stream response';
        write({ type: 'error', message: errorMessage });
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
