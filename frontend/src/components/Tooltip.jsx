import React from 'react';

/**
 * Simple Tooltip component using CSS only (no JS state)
 * Wrap any element with this to show a tooltip on hover
 * 
 * Usage: <Tooltip text="Your explanation here"><Info className="w-3 h-3" /></Tooltip>
 */
const Tooltip = ({ children, text, position = 'top' }) => {
    const positionClasses = {
        top: 'bottom-full left-1/2 -translate-x-1/2 mb-1',
        bottom: 'top-full left-1/2 -translate-x-1/2 mt-1',
        left: 'right-full top-1/2 -translate-y-1/2 mr-1',
        right: 'left-full top-1/2 -translate-y-1/2 ml-1',
    };

    return (
        <span className="relative inline-flex group/tooltip">
            {children}
            <span
                className={`
                    absolute ${positionClasses[position]}
                    px-2 py-1
                    bg-[#111] border border-[#444] text-white
                    text-[10px] leading-snug
                    rounded shadow-xl
                    opacity-0 invisible group-hover/tooltip:opacity-100 group-hover/tooltip:visible
                    transition-opacity duration-100
                    w-max max-w-[200px]
                    pointer-events-none
                    z-[9999]
                `}
            >
                {text}
            </span>
        </span>
    );
};

export default Tooltip;
