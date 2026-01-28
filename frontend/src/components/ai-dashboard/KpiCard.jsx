import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/card';

const trendConfig = {
    up: {
        icon: TrendingUp,
        text: 'text-emerald-400',
        bg: 'bg-emerald-500/10',
        label: 'Up'
    },
    down: {
        icon: TrendingDown,
        text: 'text-rose-400',
        bg: 'bg-rose-500/10',
        label: 'Down'
    },
    flat: {
        icon: Minus,
        text: 'text-amber-400',
        bg: 'bg-amber-500/10',
        label: 'Flat'
    }
};

const KpiCard = ({ element }) => {
    const props = element?.props || {};
    const { title, value, subtitle, delta, deltaLabel, trend = 'flat' } = props;
    const trendStyle = trendConfig[trend] || trendConfig.flat;
    const TrendIcon = trendStyle.icon;

    return (
        <Card className="border border-border bg-[var(--surface)] shadow-lg h-full flex flex-col">
            <CardHeader className="space-y-1">
                <CardTitle>{title || 'Metric'}</CardTitle>
                {subtitle && <CardDescription>{subtitle}</CardDescription>}
            </CardHeader>
            <CardContent className="flex flex-1 flex-col gap-3">
                <div className="text-3xl font-semibold text-primary tracking-tight">
                    {value ?? '—'}
                </div>
                <div className="mt-auto min-h-[26px] flex items-center gap-2 text-xs">
                    {(delta || deltaLabel) ? (
                        <>
                            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full ${trendStyle.bg} ${trendStyle.text}`}>
                                <TrendIcon className="w-3 h-3" />
                                {delta ?? trendStyle.label}
                            </span>
                            {deltaLabel && <span className="text-muted">{deltaLabel}</span>}
                        </>
                    ) : (
                        <span className="text-muted/40">&nbsp;</span>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};

export default KpiCard;
