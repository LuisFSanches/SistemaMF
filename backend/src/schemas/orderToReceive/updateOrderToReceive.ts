import { z } from "zod";

export const updateOrderToReceiveSchema = z.object({
    payment_due_date: z.string().datetime("payment_due_date must be a valid datetime").optional(),
    received_date: z.string().datetime("received_date must be a valid datetime").optional(),
    type: z.string().nonempty("type cannot be empty").optional(),
    is_archived: z.boolean().optional(),
});

export type UpdateOrderToReceiveSchemaType = z.infer<typeof updateOrderToReceiveSchema>;
