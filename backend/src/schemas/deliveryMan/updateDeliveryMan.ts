import { z } from "zod";

export const updateDeliveryManSchema = z.object({
    name: z.string().optional(),
    phone_number: z.string().optional(),
});

export type UpdateDeliveryManSchemaType = z.infer<typeof updateDeliveryManSchema>;
