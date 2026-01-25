import React, { createContext, useContext, useState, useRef, useEffect, useCallback } from 'react';
import { streamChat } from '../services/chatStream';
import useUiPatchStream from '../hooks/useUiPatchStream';

const ChatContext = createContext(null);

const INITIAL_MESSAGE = {
    role: 'assistant',
    parts: [
        {
            type: 'text',
            content: 'Hello! I can help you query the HR database. Try asking things like:\n\n• "How many employees do we have?"\n• "Show me employees in the IT department"\n• "What\'s the average appraisal score?"'
        }
    ]
};

export const ChatProvider = ({ children }) => {
    const [messages, setMessages] = useState([INITIAL_MESSAGE]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { trees, updateTree, clearTrees } = useUiPatchStream();
    const inputRef = useRef(null);

    // Track completed actions { actionId: { success, message } }
    const [completedActions, setCompletedActions] = useState({});

    // Listen for action completion events from ActionCard
    useEffect(() => {
        const handleActionComplete = (event) => {
            const { actionId, success, message, cancelled } = event.detail;

            // Mark this action as completed so all instances sync
            setCompletedActions(prev => ({
                ...prev,
                [actionId]: { success, message, cancelled }
            }));

            // Add a system message so the AI knows what happened
            const actionResult = success
                ? `[ACTION COMPLETED] ${message}`
                : `[ACTION FAILED] ${message}`;
            setMessages(prev => [...prev, {
                role: 'assistant',
                parts: [{ type: 'text', content: actionResult }],
                isSystemMessage: true
            }]);
        };
        window.addEventListener('actionComplete', handleActionComplete);
        return () => window.removeEventListener('actionComplete', handleActionComplete);
    }, []);

    const handleSubmit = useCallback(async (userInput, onSubmitComplete) => {
        if (!userInput.trim() || isLoading) return;

        const userMessage = userInput.trim();
        setInput('');
        setMessages(prev => [...prev, { role: 'user', parts: [{ type: 'text', content: userMessage }] }]);
        setIsLoading(true);

        const assistantId = `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
        setMessages(prev => [
            ...prev,
            { role: 'assistant', id: assistantId, parts: [{ type: 'text', content: '' }] }
        ]);

        // Get current messages for history (before adding user message)
        const history = messages
            .slice(1)
            .map(msg => ({
                role: msg.role,
                content: msg.parts?.filter(part => part.type === 'text').map(part => part.content || '').join('') || ''
            }));

        try {
            await streamChat({
                message: userMessage,
                history,
                onText: (text) => {
                    setMessages(prev =>
                        prev.map(msg => {
                            if (msg.id !== assistantId) return msg;
                            const parts = msg.parts || [];
                            const lastPart = parts[parts.length - 1];

                            let updatedParts;
                            if (!lastPart || lastPart.type !== 'text') {
                                // Add new text part
                                updatedParts = [...parts, { type: 'text', content: text }];
                            } else {
                                // Create new part object with appended content (no mutation)
                                const newLastPart = { ...lastPart, content: lastPart.content + text };
                                updatedParts = [...parts.slice(0, -1), newLastPart];
                            }
                            return { ...msg, parts: updatedParts };
                        })
                    );
                },
                onPatch: (payload) => {
                    const blockId = payload.blockId || 'default';
                    updateTree(blockId, payload.patch);
                    setMessages(prev =>
                        prev.map(msg => {
                            if (msg.id !== assistantId) return msg;
                            const updatedParts = [...msg.parts];
                            const lastPart = updatedParts[updatedParts.length - 1];
                            if (!lastPart || lastPart.type !== 'ui' || lastPart.blockId !== blockId) {
                                updatedParts.push({ type: 'ui', blockId });
                            }
                            return { ...msg, parts: updatedParts };
                        })
                    );
                },
                onDone: () => {
                    setIsLoading(false);
                    if (onSubmitComplete) onSubmitComplete();
                },
                onError: (error) => {
                    console.error('Chat error:', error);
                    setMessages(prev =>
                        prev.map(msg => {
                            if (msg.id !== assistantId) return msg;
                            return {
                                ...msg,
                                parts: [
                                    ...msg.parts,
                                    { type: 'text', content: 'Sorry, I encountered an error. Please try again.' }
                                ]
                            };
                        })
                    );
                    setIsLoading(false);
                    if (onSubmitComplete) onSubmitComplete();
                }
            });
        } catch (error) {
            console.error('Chat error:', error);
            setMessages(prev =>
                prev.map(msg =>
                    msg.id === assistantId
                        ? {
                            ...msg,
                            parts: [
                                ...msg.parts,
                                { type: 'text', content: 'Sorry, I encountered an error. Please try again.' }
                            ]
                        }
                        : msg
                )
            );
            setIsLoading(false);
            if (onSubmitComplete) onSubmitComplete();
        }
    }, [isLoading, messages, updateTree]);

    const clearChat = useCallback(() => {
        setMessages([INITIAL_MESSAGE]);
        setInput('');
        setIsLoading(false);
        clearTrees();
        setCompletedActions({});
    }, [clearTrees]);

    const value = {
        messages,
        setMessages,
        input,
        setInput,
        isLoading,
        trees,
        inputRef,
        handleSubmit,
        completedActions,
        clearChat
    };

    return (
        <ChatContext.Provider value={value}>
            {children}
        </ChatContext.Provider>
    );
};

export const useChatContext = () => {
    const context = useContext(ChatContext);
    if (!context) {
        throw new Error('useChatContext must be used within a ChatProvider');
    }
    return context;
};

export default ChatContext;
