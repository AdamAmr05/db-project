import React from 'react';
import clsx from 'clsx';

const DashboardShell = ({ element, children }) => {
    const props = element?.props || {};
    const { title, subtitle, meta } = props;

    return (
        <div className="space-y-6">
            {(title || subtitle || meta) && (
                <div className="relative overflow-hidden border border-border bg-[var(--surface)] shadow-lg">
                    <div className="absolute inset-0 opacity-40 pointer-events-none bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.08),_transparent_70%)]" />
                    <div className="relative p-6 space-y-2">
                        {meta && (
                            <p className="text-[10px] font-mono uppercase tracking-[0.25em] text-muted">
                                {meta}
                            </p>
                        )}
                        <h1 className={clsx(
                            'text-2xl font-semibold tracking-tight text-primary',
                            !title && 'text-muted'
                        )}>
                            {title || 'AI Dashboard'}
                        </h1>
                        {subtitle && (
                            <p className="text-sm text-muted max-w-3xl">{subtitle}</p>
                        )}
                    </div>
                </div>
            )}
            <div className="space-y-6">
                {children}
            </div>
        </div>
    );
};

export default DashboardShell;
