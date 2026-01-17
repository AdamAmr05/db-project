import React, { useMemo } from 'react';
import {
    ResponsiveContainer,
    BarChart,
    Bar,
    LineChart,
    Line,
    AreaChart,
    Area,
    PieChart,
    Pie,
    Cell,
    Tooltip,
    XAxis,
    YAxis
} from 'recharts';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/card';

const fallbackPalette = ['#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899', '#f97316'];

const tooltipStyle = {
    backgroundColor: 'var(--tooltip-bg)',
    border: '1px solid var(--tooltip-border)',
    borderRadius: '6px',
    color: 'var(--tooltip-text)',
    fontSize: '0.75rem',
    padding: '8px 12px'
};

const ChartBlock = ({ element }) => {
    const { title, description, chartType, data, xKey, series, nameKey, valueKey } = element.props;

    const sanitizedData = useMemo(() => (Array.isArray(data) ? data : []), [data]);
    const resolvedSeries = useMemo(() => {
        if (Array.isArray(series) && series.length) {
            return series.map((item, index) => ({
                ...item,
                color: item.color || fallbackPalette[index % fallbackPalette.length]
            }));
        }
        return [];
    }, [series]);

    const renderCartesianChart = () => {
        if (!xKey || !resolvedSeries.length) {
            return <div className="text-xs text-muted font-mono">Missing chart configuration.</div>;
        }

        const commonProps = {
            data: sanitizedData,
            margin: { top: 8, right: 16, left: 0, bottom: 8 }
        };

        const isStacked = chartType === 'stacked-bar';
        const ChartComponent = chartType === 'area' ? AreaChart : chartType === 'line' ? LineChart : BarChart;

        return (
            <ResponsiveContainer width="100%" height={240}>
                <ChartComponent {...commonProps}>
                    <XAxis dataKey={xKey} tick={{ fontSize: 10, fill: 'var(--text-muted)' }} />
                    <YAxis tick={{ fontSize: 10, fill: 'var(--text-muted)' }} />
                    <Tooltip contentStyle={tooltipStyle} itemStyle={{ color: 'var(--tooltip-text)' }} labelStyle={{ color: 'var(--tooltip-text)' }} />
                    {resolvedSeries.map((serie) => {
                        if (chartType === 'line') {
                            return <Line key={serie.key} dataKey={serie.key} stroke={serie.color} strokeWidth={2} dot={false} />;
                        }
                        if (chartType === 'area') {
                            return (
                                <Area
                                    key={serie.key}
                                    dataKey={serie.key}
                                    stroke={serie.color}
                                    fill={serie.color}
                                    fillOpacity={0.2}
                                    strokeWidth={2}
                                />
                            );
                        }
                        return (
                            <Bar
                                key={serie.key}
                                dataKey={serie.key}
                                fill={serie.color}
                                radius={isStacked ? [0, 0, 0, 0] : [6, 6, 0, 0]}
                                stackId={isStacked ? 'stack' : undefined}
                            />
                        );
                    })}
                </ChartComponent>
            </ResponsiveContainer>
        );
    };

    const renderPieChart = () => {
        if (!nameKey || !valueKey) {
            return <div className="text-xs text-muted font-mono">Missing chart configuration.</div>;
        }

        return (
            <ResponsiveContainer width="100%" height={240}>
                <PieChart>
                    <Tooltip contentStyle={tooltipStyle} itemStyle={{ color: 'var(--tooltip-text)' }} labelStyle={{ color: 'var(--tooltip-text)' }} />
                    <Pie data={sanitizedData} dataKey={valueKey} nameKey={nameKey} innerRadius={50} outerRadius={90}>
                        {sanitizedData.map((entry, index) => (
                            <Cell key={`${entry[nameKey]}-${index}`} fill={fallbackPalette[index % fallbackPalette.length]} />
                        ))}
                    </Pie>
                </PieChart>
            </ResponsiveContainer>
        );
    };

    return (
        <Card className="border border-[var(--border)] bg-[var(--surface)] shadow-lg">
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                {description ? <CardDescription>{description}</CardDescription> : null}
            </CardHeader>
            <CardContent>{chartType === 'pie' ? renderPieChart() : renderCartesianChart()}</CardContent>
        </Card>
    );
};

export default ChartBlock;
