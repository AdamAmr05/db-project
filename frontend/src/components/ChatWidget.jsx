import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Loader2, Bot, User } from 'lucide-react';
import { chatService } from '../services/chatService';

const ChatWidget = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: 'assistant', content: 'Hello! I can help you query the HR database. Try asking things like:\n\n• "How many employees do we have?"\n• "Show me employees in the IT department"\n• "What\'s the average appraisal score?"' }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage = input.trim();
        setInput('');
        setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
        setIsLoading(true);

        try {
            // Build history for context (exclude the welcome message)
            const history = messages
                .slice(1) // Skip welcome message
                .map(msg => ({ role: msg.role, content: msg.content }));

            const response = await chatService.sendMessage(userMessage, history);

            if (response.data.success) {
                setMessages(prev => [...prev, {
                    role: 'assistant',
                    content: response.data.response
                }]);
            } else {
                setMessages(prev => [...prev, {
                    role: 'assistant',
                    content: `Error: ${response.data.error || 'Something went wrong'}`
                }]);
            }
        } catch (error) {
            console.error('Chat error:', error);
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: 'Sorry, I encountered an error. Please try again.'
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    const formatMessage = (content) => {
        // Simple markdown-like formatting for tables and lists
        return content.split('\n').map((line, i) => {
            // Bold text
            line = line.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
            // Bullet points
            if (line.startsWith('• ') || line.startsWith('- ')) {
                return <div key={i} className="ml-2">{line}</div>;
            }
            // Table rows (basic detection)
            if (line.startsWith('|')) {
                return <div key={i} className="font-mono text-xs">{line}</div>;
            }
            return <div key={i} dangerouslySetInnerHTML={{ __html: line || '&nbsp;' }} />;
        });
    };

    return (
        <>
            {/* Floating Button */}
            <button
                onClick={() => setIsOpen(true)}
                className={`fixed bottom-6 right-6 z-50 w-14 h-14 bg-primary text-[var(--primary-inverted)] rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-105 active:scale-95 ${isOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
                aria-label="Open AI Chat"
            >
                <MessageSquare className="w-6 h-6" />
            </button>

            {/* Chat Panel */}
            <div className={`fixed bottom-6 right-6 z-50 w-96 h-[32rem] flex flex-col bg-surface border border-border shadow-2xl transition-all duration-300 ${isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}>
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-[var(--surface-highlight)]">
                    <div className="flex items-center gap-2">
                        <Bot className="w-5 h-5 text-primary" />
                        <span className="font-mono text-sm uppercase tracking-wider text-primary">AI_ASSISTANT</span>
                    </div>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="p-1 hover:bg-border rounded transition-colors"
                    >
                        <X className="w-5 h-5 text-muted" />
                    </button>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.map((msg, idx) => (
                        <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                            <div className={`w-7 h-7 rounded flex items-center justify-center flex-shrink-0 ${msg.role === 'user' ? 'bg-primary text-[var(--primary-inverted)]' : 'bg-border text-primary'}`}>
                                {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                            </div>
                            <div className={`max-w-[80%] px-3 py-2 text-sm ${msg.role === 'user' ? 'bg-primary text-[var(--primary-inverted)]' : 'bg-[var(--surface-highlight)] text-primary border border-border'}`}>
                                {formatMessage(msg.content)}
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex gap-3">
                            <div className="w-7 h-7 rounded flex items-center justify-center flex-shrink-0 bg-border text-primary">
                                <Bot className="w-4 h-4" />
                            </div>
                            <div className="px-3 py-2 bg-[var(--surface-highlight)] border border-border">
                                <Loader2 className="w-4 h-4 animate-spin text-muted" />
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <form onSubmit={handleSubmit} className="p-3 border-t border-border bg-[var(--surface-highlight)]">
                    <div className="flex gap-2">
                        <input
                            ref={inputRef}
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ask about the database..."
                            className="flex-1 px-3 py-2 bg-surface border border-border text-primary text-sm focus:border-primary outline-none transition-colors placeholder:text-muted font-mono"
                            disabled={isLoading}
                        />
                        <button
                            type="submit"
                            disabled={!input.trim() || isLoading}
                            className="px-3 py-2 bg-primary text-[var(--primary-inverted)] disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
                        >
                            <Send className="w-4 h-4" />
                        </button>
                    </div>
                </form>

                {/* Corner Accents */}
                <div className="absolute top-0 left-0 w-3 h-3 border-l-2 border-t-2 border-primary opacity-30" />
                <div className="absolute top-0 right-0 w-3 h-3 border-r-2 border-t-2 border-primary opacity-30" />
                <div className="absolute bottom-0 left-0 w-3 h-3 border-l-2 border-b-2 border-primary opacity-30" />
                <div className="absolute bottom-0 right-0 w-3 h-3 border-r-2 border-b-2 border-primary opacity-30" />
            </div>
        </>
    );
};

export default ChatWidget;
