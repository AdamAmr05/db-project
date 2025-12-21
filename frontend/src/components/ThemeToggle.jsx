import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon } from 'lucide-react';

const ThemeToggle = () => {
    const { theme, toggleTheme } = useTheme();
    const isDark = theme === 'dark';

    return (
        <button
            onClick={toggleTheme}
            className="relative p-2 border border-border hover:border-primary transition-all duration-300 group"
            aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
            title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
        >
            <div className="relative w-5 h-5 overflow-hidden">
                {/* Sun Icon */}
                <Sun
                    className={`absolute w-5 h-5 text-muted group-hover:text-accent transition-all duration-300 ${isDark
                            ? 'opacity-100 rotate-0 scale-100'
                            : 'opacity-0 -rotate-90 scale-0'
                        }`}
                />
                {/* Moon Icon */}
                <Moon
                    className={`absolute w-5 h-5 text-muted group-hover:text-accent transition-all duration-300 ${isDark
                            ? 'opacity-0 rotate-90 scale-0'
                            : 'opacity-100 rotate-0 scale-100'
                        }`}
                />
            </div>
        </button>
    );
};

export default ThemeToggle;
