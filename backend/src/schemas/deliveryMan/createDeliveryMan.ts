import { z } from "zod";

export const createDeliveryManSchema = z.object({
    name: z.string().nonempty("name is required"),
    phone_number: z.string().nonempty("phone_number is required"),
});

export type CreateDeliveryManSchemaType = z.infer<typeof createDeliveryManSchema>;
