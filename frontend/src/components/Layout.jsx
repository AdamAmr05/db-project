import React, { useState } from 'react';
import Sidebar, { SidebarContext } from './Sidebar';
import Header from './Header';
import ChatWidget from './ChatWidget';
import clsx from 'clsx';

const Layout = ({ children }) => {
    const [isCollapsed, setIsCollapsed] = useState(false);

    return (
        <SidebarContext.Provider value={{ isCollapsed, setIsCollapsed }}>
            <div className="min-h-screen bg-background text-primary font-sans">
                <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
                <Header isCollapsed={isCollapsed} />
                <main className={clsx(
                    'p-8 min-h-[calc(100vh-4rem)] relative transition-all duration-300',
                    isCollapsed ? 'ml-16' : 'ml-64'
                )}>
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
        </SidebarContext.Provider>
    );
};

export default Layout;
