import { z } from "zod";

export const updateOrderDeliverySchema = z.object({
    delivery_man_id: z.string().uuid("delivery_man_id must be a valid UUID").optional(),
    delivery_date: z.string().datetime("delivery_date must be a valid datetime").optional(),
    is_paid: z.boolean().optional(),
    is_archived: z.boolean().optional(),
});

export type UpdateOrderDeliverySchemaType = z.infer<typeof updateOrderDeliverySchema>;
