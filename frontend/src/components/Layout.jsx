import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

const Layout = ({ children }) => {
    return (
        <div className="min-h-screen bg-background text-primary font-sans selection:bg-white selection:text-black">
            <Sidebar />
            <Header />
            <main className="ml-64 p-8 min-h-[calc(100vh-4rem)] relative">
                <div className="max-w-7xl mx-auto">
                    {children}
                </div>
                {/* Background Grid Effect */}
                <div className="fixed inset-0 pointer-events-none z-[-1] opacity-[0.02]"
                    style={{
                        backgroundImage: 'linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)',
                        backgroundSize: '40px 40px'
                    }}
                />
            </main>
        </div>
    );
};

export default Layout;
