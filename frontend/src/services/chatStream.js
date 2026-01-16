import { API_BASE_URL } from './api';

export async function streamChat({ message, history = [], onText, onPatch, onDone, onError }) {
    console.log('[streamChat] Starting request to', `${API_BASE_URL}/chat/stream`);

    // Guard to ensure onDone is only called once
    let doneCalled = false;
    const callDoneOnce = () => {
        if (!doneCalled) {
            doneCalled = true;
            onDone?.();
        }
    };

    try {
        const response = await fetch(`${API_BASE_URL}/chat/stream`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message, history })
        });

        console.log('[streamChat] Response status:', response.status);

        if (!response.ok || !response.body) {
            throw new Error(`HTTP error: ${response.status}`);
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split('\n');
            buffer = lines.pop() ?? '';

            for (const line of lines) {
                const trimmed = line.trim();
                if (!trimmed) continue;

                try {
                    const payload = JSON.parse(trimmed);
                    console.log('[streamChat] Received payload:', payload.type);
                    if (payload.type === 'text') {
                        onText?.(payload.value ?? '');
                    } else if (payload.type === 'ui' && payload.patch) {
                        onPatch?.(payload);
                    } else if (payload.type === 'done') {
                        callDoneOnce();
                    } else if (payload.type === 'error') {
                        console.error('[streamChat] Server error:', payload.message);
                        onError?.(new Error(payload.message || 'Server error'));
                    }
                } catch (err) {
                    console.warn('[streamChat] Failed to parse line:', trimmed, err);
                }
            }
        }

        // Handle remaining buffer
        if (buffer.trim()) {
            try {
                const payload = JSON.parse(buffer.trim());
                if (payload.type === 'text') {
                    onText?.(payload.value ?? '');
                } else if (payload.type === 'ui' && payload.patch) {
                    onPatch?.(payload);
                } else if (payload.type === 'done') {
                    callDoneOnce();
                } else if (payload.type === 'error') {
                    console.error('[streamChat] Server error (buffer):', payload.message);
                    onError?.(new Error(payload.message || 'Server error'));
                }
            } catch (err) {
                console.warn('[streamChat] Failed to parse buffer:', buffer, err);
            }
        }

        // Always call onDone when stream ends (if not already called)
        callDoneOnce();
    } catch (error) {
        console.error('[streamChat] Fetch error:', error);
        onError?.(error instanceof Error ? error : new Error(String(error)));
    }
}
