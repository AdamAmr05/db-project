import React, { useRef, useEffect } from 'react';
import { Send, Loader2, Bot, User } from 'lucide-react';
import { Renderer, JSONUIProvider } from '@json-render/react';
import { useChatContext } from '../context/ChatContext';
import { ChatBubble } from '../components/ChatWidget';
import { registry } from '../json-render/registry';

const ChatPage = () => {
    const { messages, input, setInput, isLoading, trees, handleSubmit } = useChatContext();
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, []);

    const onFormSubmit = async (e) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage = input;

        // Reset textarea height
        if (inputRef.current) {
            inputRef.current.style.height = 'auto';
            inputRef.current.style.height = '48px';
        }

        await handleSubmit(userMessage);
    };

    return (
        <div className="flex flex-col h-full" style={{ maxHeight: 'calc(100vh - 120px)' }}>
            {/* Header */}
            <div className="flex items-center gap-3 py-6 border-b border-border">
                <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
                    <Bot className="w-6 h-6 text-[var(--primary-inverted)]" />
                </div>
                <div>
                    <h1 className="text-xl font-bold text-primary">AI Assistant</h1>
                    <p className="text-xs text-muted font-mono uppercase tracking-wider">HR Database Query Interface</p>
                </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto py-6 space-y-6">
                {messages.filter(msg => !msg.isSystemMessage).map((msg, idx) => {
                    // Skip empty assistant messages (waiting for first content)
                    if (msg.role === 'assistant') {
                        const hasContent = msg.parts?.some(part =>
                            (part.type === 'text' && part.content?.trim()) ||
                            (part.type === 'ui' && trees[part.blockId])
                        );
                        if (!hasContent) return null;
                    }

                    return (
                        <div key={msg.id || idx} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                            <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${msg.role === 'user' ? 'bg-primary text-[var(--primary-inverted)]' : 'bg-surface border border-border text-primary'}`}>
                                {msg.role === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
                            </div>
                            <div className={`max-w-[85%] px-4 py-3 rounded-lg text-sm ${msg.role === 'user' ? 'bg-primary text-[var(--primary-inverted)]' : 'bg-surface border border-border text-primary'}`}>
                                {msg.parts?.map((part, partIndex) => {
                                    if (part.type === 'ui') {
                                        const tree = trees[part.blockId];
                                        if (!tree) return null;
                                        return (
                                            <div key={`${part.blockId}-${partIndex}`} className="my-2">
                                                <JSONUIProvider registry={registry}>
                                                    <Renderer tree={tree} registry={registry} />
                                                </JSONUIProvider>
                                            </div>
                                        );
                                    }
                                    return (
                                        <div key={`text-${partIndex}`}>
                                            <ChatBubble content={part.content || ''} />
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
                {isLoading && (
                    <div className="flex gap-4">
                        <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 bg-surface border border-border text-primary">
                            <Bot className="w-5 h-5" />
                        </div>
                        <div className="px-4 py-3 bg-surface border border-border rounded-lg">
                            <Loader2 className="w-5 h-5 animate-spin text-muted" />
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="py-4 border-t border-border">
                <form onSubmit={onFormSubmit} className="flex gap-3 items-end">
                    <div className="flex-1 relative">
                        <textarea
                            ref={inputRef}
                            value={input}
                            onChange={(e) => {
                                setInput(e.target.value);
                                // Auto-resize
                                e.target.style.height = 'auto';
                                e.target.style.height = Math.min(e.target.scrollHeight, 200) + 'px';
                            }}
                            onKeyDown={(e) => {
                                // Submit on Enter (without shift)
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    if (input.trim() && !isLoading) {
                                        onFormSubmit(e);
                                    }
                                }
                            }}
                            placeholder="Ask about the HR database..."
                            className="w-full px-4 py-3 bg-surface border border-border rounded-lg text-primary text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-muted font-mono resize-none overflow-hidden"
                            style={{ minHeight: '48px', maxHeight: '200px' }}
                            disabled={isLoading}
                            rows={1}
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={!input.trim() || isLoading}
                        className="px-4 py-3 bg-primary text-[var(--primary-inverted)] rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:opacity-90 h-[48px] flex items-center gap-2"
                    >
                        <Send className="w-4 h-4" />
                        <span className="text-sm font-medium">Send</span>
                    </button>
                </form>
                <p className="text-xs text-muted mt-2 text-center">
                    Press <kbd className="px-1.5 py-0.5 bg-surface border border-border rounded text-xs font-mono">Enter</kbd> to send, <kbd className="px-1.5 py-0.5 bg-surface border border-border rounded text-xs font-mono">Shift+Enter</kbd> for new line
                </p>
            </div>
        </div>
    );
};

export default ChatPage;
