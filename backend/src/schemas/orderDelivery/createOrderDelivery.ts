import { z } from "zod";

export const createOrderDeliverySchema = z.object({
    order_id: z.string().uuid("order_id must be a valid UUID"),
    delivery_man_id: z.string().uuid("delivery_man_id must be a valid UUID"),
    delivery_date: z.string().datetime("delivery_date must be a valid datetime"),
    is_paid: z.boolean().optional(),
    is_archived: z.boolean().optional(),
});

export type CreateOrderDeliverySchemaType = z.infer<typeof createOrderDeliverySchema>;
