/**
 * json-render Catalog for HR Chat Assistant
 * Defines the components and their schemas that AI can generate
 */
const { createCatalog, generateCatalogPrompt } = require('@json-render/core');
const { z } = require('zod');

// Series schema for charts
const seriesSchema = z.object({
    key: z.string().describe('Data key to plot'),
    label: z.string().optional().describe('Display label for legend'),
    color: z.string().optional().describe('Color hex code')
});

// Create the catalog with all available UI components
const catalog = createCatalog({
    components: {
        ChartCard: {
            description: 'Displays data visualizations. Use for trends, distributions, and comparisons. Supports bar, line, area, and pie charts.',
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
                maxRows: z.number().optional().default(10).describe('Maximum rows to display')
            })
        }
    }
});

// Generate the catalog prompt for AI
const catalogPrompt = generateCatalogPrompt(catalog);

module.exports = {
    catalog,
    catalogPrompt
};
