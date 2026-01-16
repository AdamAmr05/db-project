import { createCatalog } from '@json-render/core';
import { z } from 'zod';

const seriesSchema = z.object({
    key: z.string(),
    label: z.string().optional(),
    color: z.string().optional()
});

export const catalog = createCatalog({
    components: {
        ChartCard: {
            description: 'Chart card with title, description, and visualization.',
            props: z.object({
                title: z.string(),
                description: z.string().optional(),
                chartType: z.enum(['bar', 'stacked-bar', 'line', 'area', 'pie']),
                data: z.array(z.record(z.string(), z.any())),
                xKey: z.string().optional(),
                series: z.array(seriesSchema).optional(),
                nameKey: z.string().optional(),
                valueKey: z.string().optional()
            })
        },
        DataTable: {
            description: 'Data table with columns and rows for structured data.',
            props: z.object({
                title: z.string(),
                description: z.string().optional(),
                columns: z.array(z.object({
                    key: z.string(),
                    label: z.string(),
                    align: z.enum(['left', 'center', 'right']).optional()
                })),
                data: z.array(z.record(z.string(), z.any())),
                maxRows: z.number().optional()
            })
        }
    }
});
