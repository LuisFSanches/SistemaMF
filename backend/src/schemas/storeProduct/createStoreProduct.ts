import { z } from "zod";

export const createStoreProductSchema = z.object({
    store_id: z.string().nonempty("store_id is required"),
    product_id: z.string().nonempty("product_id is required"),
    price: z.number().positive("price must be positive"),
    stock: z.number().min(0, "stock cannot be negative"),
    enabled: z.boolean().optional(),
    visible_for_online_store: z.boolean().optional(),
});

export type CreateStoreProductSchemaType = z.infer<typeof createStoreProductSchema>;
