import React from 'react';

const SectionHeader = ({ element }) => {
    const props = element?.props || {};
    const { title, subtitle, eyebrow } = props;

    if (!title && !subtitle && !eyebrow) {
        return null;
    }

    return (
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
    );
};

export default SectionHeader;
