/**
 * json-render Catalog for AI Dashboard
 * Defines the components and their schemas that AI can generate
 */
const { createCatalog, generateCatalogPrompt } = require('@json-render/core');
const { z } = require('zod');

const seriesSchema = z.object({
    key: z.string().describe('Data key to plot'),
    label: z.string().optional().describe('Display label for legend'),
    color: z.string().optional().describe('Color hex code')
});

const catalog = createCatalog({
    components: {
        DashboardShell: {
            description: 'Top-level dashboard container. Use as the root element.',
            props: z.object({
                title: z.string().optional().describe('Dashboard title'),
                subtitle: z.string().optional().describe('Short subtitle or timeframe'),
                meta: z.string().optional().describe('Small metadata line, e.g., "Generated for Q2"')
            })
        },
        SectionHeader: {
            description: 'Section header for grouping dashboard content.',
            props: z.object({
                title: z.string().describe('Section title'),
                subtitle: z.string().optional().describe('Short supporting text'),
                eyebrow: z.string().optional().describe('Small uppercase label')
            })
        },
        Grid: {
            description: 'Grid layout container. Children should be GridItem components.',
            props: z.object({
                columns: z.number().min(1).max(12).optional().default(12).describe('Number of columns'),
                gap: z.number().min(2).max(10).optional().default(4).describe('Gap size between grid items')
            })
        },
        GridItem: {
            description: 'Grid item container. Place cards/charts/tables inside.',
            props: z.object({
                span: z.number().min(1).max(12).optional().default(12).describe('Column span (1-12)'),
                rowSpan: z.number().min(1).max(6).optional().describe('Row span')
            })
        },
        KpiCard: {
            description: 'Key metric card with value and optional delta.',
            props: z.object({
                title: z.string().describe('Metric title'),
                value: z.union([z.string(), z.number()]).describe('Metric value'),
                subtitle: z.string().optional().describe('Supporting text'),
                delta: z.union([z.string(), z.number()]).optional().describe('Change indicator, e.g., "+4.2%"'),
                deltaLabel: z.string().optional().describe('Label for the delta, e.g., "vs last quarter"'),
                trend: z.enum(['up', 'down', 'flat']).optional().describe('Trend direction')
            })
        },
        ChartCard: {
            description: 'Displays data visualizations. Use for trends, distributions, and comparisons. Supports bar, stacked-bar, line, area, and pie charts.',
            props: z.object({
                title: z.string().describe('Chart title'),
                description: z.string().optional().describe('Brief description of what the chart shows'),
                chartType: z.enum(['bar', 'stacked-bar', 'line', 'area', 'pie']).describe('Type of chart'),
                data: z.array(z.record(z.string(), z.any())).describe('Array of data objects'),
                xKey: z.string().optional().describe('Key for X-axis (bar/line/area charts)'),
                series: z.array(seriesSchema).optional().describe('Data series to plot (bar/line/area charts)'),
                nameKey: z.string().optional().describe('Key for slice names (pie charts)'),
                valueKey: z.string().optional().describe('Key for slice values (pie charts)')
            })
        },
        DataTable: {
            description: 'Displays tabular data with columns and rows. Use for detailed records, lists, and structured data.',
            props: z.object({
                title: z.string().describe('Table title'),
                description: z.string().optional().describe('Brief description'),
                columns: z.array(z.object({
                    key: z.string().describe('Data key'),
                    label: z.string().describe('Column header'),
                    align: z.enum(['left', 'center', 'right']).optional().default('left')
                })).describe('Column definitions'),
                data: z.array(z.record(z.string(), z.any())).describe('Array of row objects'),
                maxRows: z.number().optional().default(12).describe('Maximum rows to display')
            })
        }
    }
});

const dashboardCatalogPrompt = generateCatalogPrompt(catalog);

module.exports = {
    dashboardCatalog: catalog,
    dashboardCatalogPrompt
};
