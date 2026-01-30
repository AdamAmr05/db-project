import React, { useEffect, useRef, useState } from 'react';
import { JSONUIProvider, Renderer } from '@json-render/react';
import { Sparkles, Send, Loader2, Trash2 } from 'lucide-react';
import clsx from 'clsx';
import { API_BASE_URL } from '../services/api';
import { dashboardRegistry } from '../json-render/dashboardRegistry';
import useDashboardStream from '../hooks/useDashboardStream';

const promptExamples = [
    'Build an executive overview dashboard with headcount, attrition, and training KPIs.',
    'Create a performance dashboard focusing on appraisal scores and KPI completion.',
    'Show a training impact dashboard with completion rates by department.'
];

const AiDashboard = () => {
    const [prompt, setPrompt] = useState('');
    const [history, setHistory] = useState([]);
    const inputRef = useRef(null);
    const lastTreeRef = useRef(null);

    const { tree, isStreaming, error, send, clear, abort } = useDashboardStream({
        api: `${API_BASE_URL}/ai-dashboard/stream`
    });

    useEffect(() => {
        if (tree) {
            lastTreeRef.current = tree;
        }
    }, [tree]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        const trimmed = prompt.trim();
        if (!trimmed || isStreaming) return;

        const nextHistory = [...history, { role: 'user', content: trimmed }];
        setHistory(nextHistory);
        setPrompt('');

        await send(trimmed, {
            history: nextHistory,
            existingTree: lastTreeRef.current
        });
    };

    const handleReset = () => {
        if (isStreaming) {
            abort();
        }
        clear();
        setHistory([]);
        lastTreeRef.current = null;
    };

    const hasDashboard = tree?.root;
    const showExamples = !hasDashboard && !isStreaming;

    return (
        <div className="space-y-6">
            <div className="border border-border bg-[var(--surface)] shadow-lg">
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                <Sparkles className="w-5 h-5" />
                            </div>
                            <div>
                                <h2 className="text-sm font-semibold text-primary uppercase tracking-wider">AI Dashboard Studio</h2>
                                <p className="text-xs text-muted">Describe the dashboard you want. The AI will generate it live.</p>
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={handleReset}
                            className="flex items-center gap-2 text-xs font-mono text-muted border border-border px-3 py-1 rounded hover:text-primary hover:border-primary transition-colors"
                            disabled={isStreaming}
                        >
                            <Trash2 className="w-3 h-3" />
                            Clear
                        </button>
                    </div>

                    <div className="relative">
                        <textarea
                            ref={inputRef}
                            value={prompt}
                            onChange={(event) => {
                                setPrompt(event.target.value);
                                event.target.style.height = 'auto';
                                event.target.style.height = Math.min(event.target.scrollHeight, 160) + 'px';
                            }}
                            onKeyDown={(event) => {
                                if (event.key === 'Enter' && !event.shiftKey) {
                                    event.preventDefault();
                                    if (prompt.trim() && !isStreaming) {
                                        handleSubmit(event);
                                    }
                                }
                            }}
                            placeholder="Build a dashboard for Q4 performance across departments with KPIs, trend charts, and a top performers table."
                            className="w-full bg-surface border border-border text-primary text-sm focus:border-primary outline-none transition-colors placeholder:text-muted font-mono resize-none overflow-hidden p-4 pr-28 min-h-[72px]"
                            disabled={isStreaming}
                            rows={2}
                        />
                        <button
                            type="submit"
                            disabled={!prompt.trim() || isStreaming}
                            className={clsx(
                                'absolute bottom-3 right-3 px-3 py-2 bg-primary text-[var(--primary-inverted)] rounded-md flex items-center gap-2 text-xs font-semibold transition-opacity',
                                (!prompt.trim() || isStreaming) && 'opacity-50 cursor-not-allowed'
                            )}
                        >
                            {isStreaming ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                            {isStreaming ? 'Generating' : 'Generate'}
                        </button>
                    </div>

                    {showExamples && (
                        <div className="flex flex-wrap gap-2">
                            {promptExamples.map((example) => (
                                <button
                                    key={example}
                                    type="button"
                                    className="text-xs font-mono text-muted border border-border px-3 py-1 rounded-full hover:text-primary hover:border-primary transition-colors"
                                    onClick={() => {
                                        setPrompt(example);
                                        inputRef.current?.focus();
                                    }}
                                >
                                    {example}
                                </button>
                            ))}
                        </div>
                    )}
                </form>
            </div>

            <div className="border border-border bg-[var(--surface)] shadow-lg p-6 min-h-[420px]">
                {error && (
                    <div className="mb-4 text-xs text-red-400 font-mono">
                        {error.message || 'Dashboard generation failed.'}
                    </div>
                )}

                {hasDashboard ? (
                    <JSONUIProvider registry={dashboardRegistry}>
                        <Renderer tree={tree} registry={dashboardRegistry} loading={isStreaming} />
                    </JSONUIProvider>
                ) : (
                    <div className="h-full flex flex-col items-center justify-center text-center gap-4 text-muted">
                        <div className="w-12 h-12 rounded-full border border-border flex items-center justify-center">
                            <Sparkles className="w-5 h-5" />
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm text-primary">Your dashboard will appear here.</p>
                            <p className="text-xs text-muted">Ask for a set of KPIs, charts, and tables to get started.</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AiDashboard;
