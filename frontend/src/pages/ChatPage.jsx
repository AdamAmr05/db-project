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
        <div className="flex flex-col w-full max-w-4xl mx-auto h-[calc(100vh-7rem)] -mb-4">
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-2">
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
                        <div key={msg.id || idx} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${msg.role === 'user' ? 'bg-primary text-[var(--primary-inverted)]' : 'bg-surface border border-border text-primary'}`}>
                                {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
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
                    <div className="flex gap-3">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 bg-surface border border-border text-primary">
                            <Bot className="w-4 h-4" />
                        </div>
                        <div className="px-4 py-3 bg-surface border border-border rounded-lg">
                            <Loader2 className="w-4 h-4 animate-spin text-muted" />
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area - more compact, right-padded to avoid bubble overlap */}
            <div className="pt-3 pb-1 border-t border-border mt-auto">
                <form onSubmit={onFormSubmit} className="flex gap-2 items-end">
                    <textarea
                        ref={inputRef}
                        value={input}
                        onChange={(e) => {
                            setInput(e.target.value);
                            // Auto-resize
                            e.target.style.height = 'auto';
                            e.target.style.height = Math.min(e.target.scrollHeight, 150) + 'px';
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
                        className="flex-1 px-3 py-2 bg-surface border border-border rounded-lg text-primary text-sm focus:border-primary outline-none transition-all placeholder:text-muted font-mono resize-none overflow-hidden"
                        style={{ minHeight: '40px', maxHeight: '150px' }}
                        disabled={isLoading}
                        rows={1}
                    />
                    <button
                        type="submit"
                        disabled={!input.trim() || isLoading}
                        className="px-3 py-2 bg-primary text-[var(--primary-inverted)] rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:opacity-90 h-[40px]"
                    >
                        <Send className="w-4 h-4" />
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ChatPage;
