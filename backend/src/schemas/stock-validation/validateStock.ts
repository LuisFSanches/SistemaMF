import { z } from "zod";

export const cartItemSchema = z.object({
    store_product_id: z.string().uuid("store_product_id must be a valid UUID"),
    quantity: z.number().positive("quantity must be a positive number"),
});

export const stockValidationSchema = z.object({
    items: z.array(cartItemSchema).min(1, "items array must contain at least one item"),
});

export type StockValidationSchemaType = z.infer<typeof stockValidationSchema>;
