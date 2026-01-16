import { useCallback, useRef, useState } from 'react';
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

    // Note: remove operation deletes the entire element when path is /elements/{key}
    // Nested path removals (e.g., /elements/foo/bar) are not supported - they will still delete the whole element
    if (patch.op === 'remove' && patch.path.startsWith('/elements/')) {
        const elementKey = patch.path.slice('/elements/'.length).split('/')[0];
        if (elementKey) {
            const { [elementKey]: _, ...rest } = nextTree.elements;
            nextTree.elements = rest;
        }
    }

    return nextTree;
};

export default function useUiPatchStream() {
    const [trees, setTrees] = useState({});
    const treesRef = useRef(trees);

    const updateTree = useCallback((blockId, patch) => {
        const currentTree = treesRef.current[blockId] ?? { root: '', elements: {} };
        const patchObj = typeof patch === 'string' ? parsePatchLine(patch) : patch;
        if (!patchObj) return;
        const nextTree = applyPatch(currentTree, patchObj);
        const nextTrees = { ...treesRef.current, [blockId]: nextTree };
        treesRef.current = nextTrees;
        setTrees(nextTrees);
    }, []);

    const clearTrees = useCallback(() => {
        treesRef.current = {};
        setTrees({});
    }, []);

    return {
        trees,
        updateTree,
        clearTrees
    };
}
