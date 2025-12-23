import React, { useState, useRef, useEffect, useCallback } from 'react';
import { MessageSquare, X, Send, Loader2, Bot, User } from 'lucide-react';
import { chatService } from '../services/chatService';

// Size constraints
const MIN_WIDTH = 320;
const MIN_HEIGHT = 400;
const MAX_WIDTH = 800;
const MAX_HEIGHT = 900;
const DEFAULT_WIDTH = 512; // 32rem
const DEFAULT_HEIGHT = 640; // 40rem

const ChatWidget = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: 'assistant', content: 'Hello! I can help you query the HR database. Try asking things like:\n\n• "How many employees do we have?"\n• "Show me employees in the IT department"\n• "What\'s the average appraisal score?"' }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    // Resize state
    const [size, setSize] = useState(() => {
        const saved = localStorage.getItem('chatWidgetSize');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                return {
                    width: Math.min(MAX_WIDTH, Math.max(MIN_WIDTH, parsed.width)),
                    height: Math.min(MAX_HEIGHT, Math.max(MIN_HEIGHT, parsed.height))
                };
            } catch { /* use defaults */ }
        }
        return { width: DEFAULT_WIDTH, height: DEFAULT_HEIGHT };
    });
    const [isResizing, setIsResizing] = useState(false);
    const resizeRef = useRef({ startX: 0, startY: 0, startWidth: 0, startHeight: 0 });

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

    // Save size to localStorage when it changes
    useEffect(() => {
        localStorage.setItem('chatWidgetSize', JSON.stringify(size));
    }, [size]);

    // Resize handlers
    const handleResizeStart = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsResizing(true);
        resizeRef.current = {
            startX: e.clientX,
            startY: e.clientY,
            startWidth: size.width,
            startHeight: size.height
        };
    }, [size]);

    useEffect(() => {
        if (!isResizing) return;

        const handleMouseMove = (e) => {
            const { startX, startY, startWidth, startHeight } = resizeRef.current;
            // Resize from top-left corner (dragging left increases width, dragging up increases height)
            const deltaX = startX - e.clientX;
            const deltaY = startY - e.clientY;

            const newWidth = Math.min(MAX_WIDTH, Math.max(MIN_WIDTH, startWidth + deltaX));
            const newHeight = Math.min(MAX_HEIGHT, Math.max(MIN_HEIGHT, startHeight + deltaY));

            setSize({ width: newWidth, height: newHeight });
        };

        const handleMouseUp = () => {
            setIsResizing(false);
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isResizing]);

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
        const lines = content.split('\n');
        const result = [];
        let tableBuffer = [];
        let inTable = false;

        // Helper to escape HTML characters to prevent XSS
        const escapeHtml = (text) => {
            return text
                .replace(/&/g, "&amp;")
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;")
                .replace(/"/g, "&quot;")
                .replace(/'/g, "&#039;");
        };

        // Helper to process inline formatting (bold, italic, code)
        const processInlineFormatting = (text) => {
            const safeText = escapeHtml(text);
            return safeText
                .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')  // **bold**
                .replace(/\*(?!\s)([^*]+?)(?<!\s)\*/g, '<em>$1</em>') // *italic* (strict: no outer spaces)
                .replace(/(\d)\*($|\s)/g, '$1<sup class="text-xs text-muted">*</sup>$2') // 8.60* -> 8.60 with superscript
                .replace(/`([^`]+)`/g, '<code class="bg-[var(--surface)] px-1 rounded text-xs">$1</code>');
        };

        const renderTable = (tableLines) => {
            if (tableLines.length < 2) return null;

            // Parse header and rows, also process bold formatting in cells
            const parseRow = (line) => line.split('|')
                .filter(cell => cell.trim() && !cell.match(/^[-:]+$/))
                .map(cell => processInlineFormatting(cell.trim()));
            const header = parseRow(tableLines[0]);
            const rows = tableLines.slice(2).map(parseRow).filter(r => r.length > 0);

            return (
                <div className="overflow-x-auto my-2">
                    <table className="w-full text-xs border border-border">
                        <thead>
                            <tr className="bg-[var(--surface)]">
                                {header.map((cell, i) => (
                                    <th key={i} className="px-2 py-1 text-left border-b border-border font-mono text-muted" dangerouslySetInnerHTML={{ __html: cell }} />
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {rows.map((row, i) => (
                                <tr key={i} className="border-b border-border/50 hover:bg-[var(--surface)]">
                                    {row.map((cell, j) => (
                                        <td key={j} className="px-2 py-1 font-mono" dangerouslySetInnerHTML={{ __html: cell }} />
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            );
        };

        lines.forEach((line, i) => {
            if (line.startsWith('|')) {
                inTable = true;
                tableBuffer.push(line);
            } else {
                if (inTable && tableBuffer.length > 0) {
                    result.push(<div key={`table-${i}`}>{renderTable(tableBuffer)}</div>);
                    tableBuffer = [];
                    inTable = false;
                }

                // Process inline formatting
                let formattedLine = processInlineFormatting(line);

                // Horizontal rule (---, ___, ***)
                if (line.match(/^[-_*]{3,}\s*$/)) {
                    result.push(
                        <div key={i} className="my-3 border-t border-border opacity-50" />
                    );
                }
                // Headers (## through #####)
                else if (line.match(/^#{2,5}\s+/)) {
                    const headerText = formattedLine.replace(/^#{2,5}\s+/, '');
                    result.push(
                        <div key={i} className="font-bold text-primary mt-3 mb-1 text-sm uppercase tracking-wide" dangerouslySetInnerHTML={{ __html: headerText }} />
                    );
                }
                // Bullet points (•, -, or * at start of line, with or without leading space)
                else if (line.match(/^\s*[•\-\*]\s/)) {
                    const bulletContent = formattedLine.replace(/^\s*[•\-\*]\s+/, '');
                    result.push(
                        <div key={i} className="flex gap-2 ml-3">
                            <span className="text-muted">•</span>
                            <span dangerouslySetInnerHTML={{ __html: bulletContent }} />
                        </div>
                    );
                } else {
                    result.push(<div key={i} dangerouslySetInnerHTML={{ __html: formattedLine || '&nbsp;' }} />);
                }
            }
        });

        // Don't forget trailing table
        if (tableBuffer.length > 0) {
            result.push(<div key="table-end">{renderTable(tableBuffer)}</div>);
        }

        return result;
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

            {/* Chat Panel - Resizable */}
            <div
                className={`fixed bottom-6 right-6 z-50 flex flex-col bg-surface border border-border shadow-2xl ${isResizing ? '' : 'transition-all duration-300'} ${isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}
                style={{ width: size.width, height: size.height }}
            >
                {/* Resize Handle - Top Left Corner */}
                <div
                    onMouseDown={handleResizeStart}
                    className="absolute -top-1 -left-1 w-4 h-4 cursor-nwse-resize z-20 group"
                    title="Drag to resize"
                >
                    <div className="absolute top-1 left-1 w-2 h-2 border-l-2 border-t-2 border-primary opacity-50 group-hover:opacity-100 transition-opacity" />
                </div>
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

                {/* Corner Accents (skip top-left, that's the resize handle) */}
                <div className="absolute top-0 right-0 w-3 h-3 border-r-2 border-t-2 border-primary opacity-30" />
                <div className="absolute bottom-0 left-0 w-3 h-3 border-l-2 border-b-2 border-primary opacity-30" />
                <div className="absolute bottom-0 right-0 w-3 h-3 border-r-2 border-b-2 border-primary opacity-30" />
            </div>
        </>
    );
};

export default ChatWidget;
