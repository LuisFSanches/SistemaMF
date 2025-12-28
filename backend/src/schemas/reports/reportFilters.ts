import { z } from "zod";

export const reportFiltersSchema = z.object({
    start_date: z.string().optional(),
    end_date: z.string().optional(),
    status: z.string().optional(),
    payment_method: z.string().optional(),
    client_id: z.string().uuid().optional(),
    product_id: z.string().uuid().optional(),
    supplier_id: z.string().uuid().optional(),
    delivery_man_id: z.string().uuid().optional(),
    online_order: z.boolean().optional(),
    store_front_order: z.boolean().optional(),
    payment_received: z.boolean().optional(),
    limit: z.number().int().positive().max(500).optional(),
    offset: z.number().int().min(0).optional(),
});

export type ReportFiltersSchemaType = z.infer<typeof reportFiltersSchema>;
