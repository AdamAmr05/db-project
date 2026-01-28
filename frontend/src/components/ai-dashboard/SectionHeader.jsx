import React from 'react';

const SectionHeader = ({ element, children }) => {
    const props = element?.props || {};
    const { title, subtitle, eyebrow, marginTop } = props;
    const hasHeader = !!(title || subtitle || eyebrow);
    const spacingStyle = marginTop ? { marginTop: `${Number(marginTop) * 4}px` } : undefined;

    if (!hasHeader && !children) {
        return null;
    }

    return (
        <div className="space-y-4" style={spacingStyle}>
            {hasHeader && (
                <div className="space-y-1">
                    {eyebrow && (
                        <div className="text-[10px] font-mono uppercase tracking-[0.3em] text-muted">
                            {eyebrow}
                        </div>
                    )}
                    {title && (
                        <h3 className="text-sm font-semibold text-primary tracking-wide uppercase">
                            {title}
                        </h3>
                    )}
                    {subtitle && (
                        <p className="text-xs text-muted">{subtitle}</p>
                    )}
                </div>
            )}
            {children ? (
                <div className="space-y-4">
                    {children}
                </div>
            ) : null}
        </div>
    );
};

export default SectionHeader;
