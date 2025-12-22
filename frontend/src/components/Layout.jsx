import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import ChatWidget from './ChatWidget';

const Layout = ({ children }) => {
    return (
        <div className="min-h-screen bg-background text-primary font-sans">
            <Sidebar />
            <Header />
            <main className="ml-64 p-8 min-h-[calc(100vh-4rem)] relative">
                <div className="max-w-7xl mx-auto">
                    {children}
                </div>
                {/* Background Grid Effect */}
                <div className="fixed inset-0 pointer-events-none z-[-1] opacity-[0.02]"
                    style={{
                        backgroundImage: 'linear-gradient(var(--grid-color) 1px, transparent 1px), linear-gradient(90deg, var(--grid-color) 1px, transparent 1px)',
                        backgroundSize: '40px 40px'
                    }}
                />
            </main>
            <ChatWidget />
        </div>
    );
};

export default Layout;

