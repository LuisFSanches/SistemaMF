import { z } from "zod";

const mercadoPagoItemSchema = z.object({
    id: z.string().nonempty("Item id is required"),
    title: z.string().nonempty("Item title is required"),
    description: z.string().optional(),
    picture_url: z.string().url().optional(),
    quantity: z.number().int().positive("Quantity must be a positive integer"),
    unit_price: z.number().positive("Unit price must be positive"),
    currency_id: z.string().default("BRL"),
});

const mercadoPagoPayerSchema = z.object({
    name: z.string().optional(),
    surname: z.string().optional(),
    email: z.string().email("Invalid email format").optional(),
    phone: z.object({
        area_code: z.string().optional(),
        number: z.string().optional(),
    }).optional(),
}).optional();

export const createPreferenceSchema = z.object({
    order_id: z.string().nonempty("Order ID is required"),
    store_slug: z.string().nonempty("Store slug is required"),
    items: z.array(mercadoPagoItemSchema).min(1, "At least one item is required"),
    payer: mercadoPagoPayerSchema,
    back_urls: z.object({
        success: z.string().url().optional(),
        failure: z.string().url().optional(),
        pending: z.string().url().optional(),
    }).optional(),
});

export type CreatePreferenceSchemaType = z.infer<typeof createPreferenceSchema>;
