const { streamText, tool, stepCountIs } = require('ai');
const { google } = require('@ai-sdk/google');
const { z } = require('zod');
const { dashboardCatalogPrompt } = require('./dashboard-catalog');
const { buildDashboardSystemPrompt } = require('./ai/dashboard-prompt');
const { createRunCode } = require('./ai/db-tools');

const MODEL_NAME = 'gemini-3-flash-preview';
const runCode = createRunCode({ defaultLimit: null });

function writePatchLine(res, patch) {
    res.write(`${JSON.stringify(patch)}\n`);
}

function streamTreeSnapshot(res, tree) {
    if (!tree || !tree.root || !tree.elements) return;
    writePatchLine(res, { op: 'set', path: '/root', value: tree.root });
    Object.values(tree.elements).forEach((element) => {
        if (!element?.key) return;
        writePatchLine(res, { op: 'set', path: `/elements/${element.key}`, value: element });
    });
}

function summarizeProps(props) {
    if (!props || typeof props !== 'object') return {};
    const summary = {};
    const allowedKeys = ['title', 'subtitle', 'description', 'value', 'chartType', 'xKey', 'nameKey', 'valueKey', 'span', 'rowSpan'];
    for (const key of allowedKeys) {
        if (props[key] !== undefined) summary[key] = props[key];
    }

    if (Array.isArray(props.series)) {
        summary.series = props.series.map((s) => s.key).slice(0, 6);
    }
    if (Array.isArray(props.columns)) {
        summary.columns = props.columns.map((c) => c.label).slice(0, 6);
    }
    if (Array.isArray(props.data)) {
        summary.data = { rows: props.data.length };
    }
    return summary;
}

function summarizeTree(tree) {
    if (!tree || !tree.root || !tree.elements) {
        return 'No existing dashboard.';
    }

    const elements = Object.values(tree.elements).map((element) => ({
        key: element.key,
        type: element.type,
        children: element.children || [],
        props: summarizeProps(element.props)
    }));

    return JSON.stringify({ root: tree.root, elements }, null, 2);
}

function summarizeHistory(history) {
    if (!Array.isArray(history) || history.length === 0) {
        return 'No prior prompts.';
    }

    const recent = history.slice(-6);
    return recent
        .map((item, index) => `(${index + 1}) ${item.role}: ${item.content}`)
        .join('\n');
}

async function stream(req, res) {
    const { prompt, context, currentTree } = req.body || {};

    if (!prompt || typeof prompt !== 'string') {
        return res.status(400).json({ success: false, error: 'prompt is required' });
    }

    const existingTree = context?.existingTree || currentTree || null;
    const treeSummary = summarizeTree(existingTree);

    const historySummary = summarizeHistory(context?.history);
    const systemPrompt = buildDashboardSystemPrompt({
        catalogPrompt: dashboardCatalogPrompt,
        treeSummary,
        historySummary
    });

    const tools = {
        runCode: tool({
            description: 'Execute JavaScript to query and analyze the HR database. Use query(sql) for SELECT-only queries.',
            inputSchema: z.object({
                code: z.string(),
                explanation: z.string().optional()
            }),
            execute: async ({ code, explanation }) => runCode(code, explanation)
        })
    };

    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Accel-Buffering', 'no');
    res.flushHeaders?.();

    if (!currentTree?.root && existingTree?.root) {
        streamTreeSnapshot(res, existingTree);
    }

    try {
        const result = streamText({
            model: google(MODEL_NAME),
            system: systemPrompt,
            messages: [{ role: 'user', content: prompt }],
            tools,
            stopWhen: stepCountIs(20)
        });

        let patchBuffer = '';

        for await (const part of result.fullStream) {
            if (part.type === 'text-delta') {
                const text = part.text || '';
                res.write(text);

                patchBuffer += text;
                const lines = patchBuffer.split('\n');
                patchBuffer = lines.pop() ?? '';
                for (const line of lines) {
                    const trimmed = line.trim();
                    if (!trimmed) continue;
                    console.log('[AI Dashboard] JSONL:', trimmed);
                    try {
                        const patch = JSON.parse(trimmed);
                        if (patch?.op === 'add' && typeof patch.path === 'string' && patch.path.includes('/children/')) {
                            console.log('[AI Dashboard] Append patch:', patch.path, patch.value);
                        }
                    } catch {
                        // ignore parse errors for partial lines
                    }
                }
            } else if (part.type === 'tool-call') {
                console.log('[AI Dashboard] Tool call:', part.toolName);
            } else if (part.type === 'tool-result') {
                console.log('[AI Dashboard] Tool result:', part.toolName);
            } else if (part.type === 'finish') {
                console.log('[AI Dashboard] Token usage:', {
                    input: part.totalUsage?.inputTokens,
                    output: part.totalUsage?.outputTokens,
                    total: part.totalUsage?.totalTokens,
                    cached: part.totalUsage?.cachedInputTokens
                });
            }
        }

        if (patchBuffer.trim()) {
            const trimmed = patchBuffer.trim();
            console.log('[AI Dashboard] JSONL:', trimmed);
            try {
                const patch = JSON.parse(trimmed);
                if (patch?.op === 'add' && typeof patch.path === 'string' && patch.path.includes('/children/')) {
                    console.log('[AI Dashboard] Append patch:', patch.path, patch.value);
                }
            } catch {
                // ignore parse errors
            }
        }

        res.end();
    } catch (error) {
        console.error('[AI Dashboard] Stream error:', error.message);
        res.status(500).end();
    }
}

module.exports = {
    stream
};
