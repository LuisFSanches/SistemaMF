import { z } from "zod";

export const createOrderToReceiveSchema = z.object({
    order_id: z.string().uuid("order_id must be a valid UUID"),
    payment_due_date: z.string().datetime("payment_due_date must be a valid datetime"),
    received_date: z.string().datetime("received_date must be a valid datetime").optional(),
    type: z.string().nonempty("type is required"),
    is_archived: z.boolean().optional(),
});

export type CreateOrderToReceiveSchemaType = z.infer<typeof createOrderToReceiveSchema>;
