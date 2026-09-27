import { z } from "zod";

export const purchaseRecencyFilterSchema = z.object({
    reference: z.enum(["SPECIAL_DATE", "FIXED_DATE"]),
    special_date_id: z.string().uuid().optional(),
    fixed_date: z.coerce.date().optional(),
    days_before: z.number().int().min(0),
    days_after: z.number().int().min(0),
}).refine(
    (data) => (data.reference === "SPECIAL_DATE" ? !!data.special_date_id : !!data.fixed_date),
    { message: "special_date_id is required when reference is SPECIAL_DATE, fixed_date otherwise" }
);

export const categoryFilterSchema = z.object({
    category_ids: z.array(z.string().uuid()).min(1),
});

export const minOrderValueFilterSchema = z.object({
    min_total: z.number().positive(),
});

// Aggregate over the client's full order history, not a single order.
export const minOrderCountFilterSchema = z.object({
    min_count: z.number().int().positive(),
});

export const segmentCriteriaSchema = z.object({
    purchase_recency: purchaseRecencyFilterSchema.optional(),
    category: categoryFilterSchema.optional(),
    min_order_value: minOrderValueFilterSchema.optional(),
    min_order_count: minOrderCountFilterSchema.optional(),
}).refine(
    (data) => Object.keys(data).length > 0,
    { message: "At least one filter must be provided" }
);

export type SegmentCriteria = z.infer<typeof segmentCriteriaSchema>;
