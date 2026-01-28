import { useCallback, useEffect, useRef, useState } from 'react';
import { setByPath } from '@json-render/core';

const parsePatchLine = (line) => {
    try {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('//')) return null;
        return JSON.parse(trimmed);
    } catch {
        return null;
    }
};

const applyPatch = (tree, patch) => {
    const nextTree = { ...tree, elements: { ...tree.elements } };

    if (patch.op === 'set' || patch.op === 'add' || patch.op === 'replace') {
        if (patch.path === '/root') {
            nextTree.root = patch.value;
            return nextTree;
        }

        if (patch.path.startsWith('/elements/')) {
            const pathParts = patch.path.slice('/elements/'.length).split('/');
            const elementKey = pathParts[0];

            if (!elementKey) return nextTree;

            if (pathParts.length === 1) {
                nextTree.elements[elementKey] = patch.value;
            } else {
                const element = nextTree.elements[elementKey];
                if (element) {
                    const propPath = `/${pathParts.slice(1).join('/')}`;
                    const updated = { ...element };
                    setByPath(updated, propPath, patch.value);
                    nextTree.elements[elementKey] = updated;
                }
            }
        }
    }

    if (patch.op === 'remove' && patch.path.startsWith('/elements/')) {
        const elementKey = patch.path.slice('/elements/'.length).split('/')[0];
        if (elementKey) {
            const { [elementKey]: _, ...rest } = nextTree.elements;
            nextTree.elements = rest;
        }
    }

    return nextTree;
};

export default function useDashboardStream({ api, onComplete, onError }) {
    const [tree, setTree] = useState(null);
    const [isStreaming, setIsStreaming] = useState(false);
    const [error, setError] = useState(null);
    const abortControllerRef = useRef(null);
    const treeRef = useRef(null);

    const clear = useCallback(() => {
        treeRef.current = null;
        setTree(null);
        setError(null);
    }, []);

    const send = useCallback(async (prompt, context) => {
        abortControllerRef.current?.abort();
        abortControllerRef.current = new AbortController();
        setIsStreaming(true);
        setError(null);

        let currentTree = treeRef.current ?? { root: '', elements: {} };
        if (!treeRef.current) {
            treeRef.current = currentTree;
            setTree(currentTree);
        }

        try {
            const response = await fetch(api, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    prompt,
                    context,
                    currentTree
                }),
                signal: abortControllerRef.current.signal
            });

            if (!response.ok) {
                throw new Error(`HTTP error: ${response.status}`);
            }

            const reader = response.body?.getReader();
            if (!reader) {
                throw new Error('No response body');
            }

            const decoder = new TextDecoder();
            let buffer = '';

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                buffer += decoder.decode(value, { stream: true });
                const lines = buffer.split('\n');
                buffer = lines.pop() ?? '';

                for (const line of lines) {
                    const patch = parsePatchLine(line);
                    if (patch) {
                        currentTree = applyPatch(currentTree, patch);
                        treeRef.current = currentTree;
                        setTree({ ...currentTree });
                    }
                }
            }

            if (buffer.trim()) {
                const patch = parsePatchLine(buffer);
                if (patch) {
                    currentTree = applyPatch(currentTree, patch);
                    treeRef.current = currentTree;
                    setTree({ ...currentTree });
                }
            }

            onComplete?.(currentTree);
        } catch (err) {
            if (err.name === 'AbortError') {
                return;
            }
            const nextError = err instanceof Error ? err : new Error(String(err));
            setError(nextError);
            onError?.(nextError);
        } finally {
            setIsStreaming(false);
        }
    }, [api, onComplete, onError]);

    useEffect(() => () => abortControllerRef.current?.abort(), []);

    return {
        tree,
        isStreaming,
        error,
        send,
        clear
    };
}
