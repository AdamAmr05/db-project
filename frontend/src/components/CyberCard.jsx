import React from 'react';
import clsx from 'clsx';

const CyberCard = ({ children, className, title, icon: Icon, dither = false }) => {
    return (
        <div className={clsx('cyber-card flex flex-col overflow-visible', className)}>
            {dither && (
                <div className="absolute inset-0 dither-bg opacity-20 pointer-events-none" />
            )}

            {(title || Icon) && (
                <div className="flex items-center justify-between mb-4 relative z-10">
                    {title && (
                        <h3 className="text-xs font-mono uppercase tracking-widest text-muted">
                            {title}
                        </h3>
                    )}
                    {Icon && <Icon className="w-4 h-4 text-muted" />}
                </div>
            )}

            <div className="relative z-10 flex-1">
                {children}
            </div>

            {/* Corner Accents - using opacity for theme-awareness */}
            <div className="absolute top-0 left-0 w-2 h-2 border-l border-t border-primary opacity-20" />
            <div className="absolute top-0 right-0 w-2 h-2 border-r border-t border-primary opacity-20" />
            <div className="absolute bottom-0 left-0 w-2 h-2 border-l border-b border-primary opacity-20" />
            <div className="absolute bottom-0 right-0 w-2 h-2 border-r border-b border-primary opacity-20" />
        </div>
    );
};

export default CyberCard;

