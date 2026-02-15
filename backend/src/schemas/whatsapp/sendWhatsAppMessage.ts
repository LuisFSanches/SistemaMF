import { z } from "zod";

export const sendWhatsAppMessageSchema = z.object({
    phone_number: z.string().nonempty("Phone number is required"),
    customer_name: z.string().optional(),
    order_number: z.string().optional(),
    store_name: z.string().optional(),
});

export type SendWhatsAppMessageSchemaType = z.infer<typeof sendWhatsAppMessageSchema>;
