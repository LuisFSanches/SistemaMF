import { z } from "zod";

export const updateMultipleOrderDeliveriesSchema = z.object({
    ids: z.array(z.string().uuid("Invalid ID format")).min(1, "At least one ID is required"),
    delivery_man_id: z.string().uuid("Invalid delivery man ID").optional(),
    delivery_date: z.string().datetime("Invalid date format").optional(),
    is_paid: z.boolean().optional(),
    is_archived: z.boolean().optional(),
});

export type UpdateMultipleOrderDeliveriesSchemaType = z.infer<typeof updateMultipleOrderDeliveriesSchema>;
