import React from 'react';
import { useLocation } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';

const Header = () => {
    const location = useLocation();

    const getTitle = () => {
        switch (location.pathname) {
            case '/': return 'System Dashboard';
            case '/employees': return 'Employee Database';
            case '/faculties': return 'Faculty Management';
            default: return 'System';
        }
    };

    return (
        <header className="h-16 border-b border-border bg-background/80 backdrop-blur-sm flex items-center px-8 sticky top-0 z-40 ml-64">
            <div className="flex items-center gap-4">
                <div className="h-4 w-1 bg-primary" />
                <h2 className="text-sm font-mono text-primary uppercase tracking-widest">
                    {getTitle()}
                </h2>
            </div>
            <div className="ml-auto flex items-center gap-4">
                <div className="text-xs text-muted font-mono">
                    {new Date().toLocaleDateString()}
                </div>
                <ThemeToggle />
            </div>
        </header>
    );
};

export default Header;

