import { z } from "zod";

export const updateStoreProductSchema = z.object({
    price: z.number().positive("price must be positive").optional(),
    stock: z.number().min(0, "stock cannot be negative").optional(),
    enabled: z.boolean().optional(),
    visible_for_online_store: z.boolean().optional(),
});

export type UpdateStoreProductSchemaType = z.infer<typeof updateStoreProductSchema>;
