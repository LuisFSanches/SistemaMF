import { z } from "zod";

export const updateStoreProductSchema = z.object({
    price: z.number().positive("price must be positive").optional(),
    stock: z.number().min(0, "stock cannot be negative").optional(),
    enabled: z.boolean().optional(),
    visible_for_online_store: z.boolean().optional(),
    image: z.string().url("image must be a valid URL").optional(),
    image_2: z.string().url("image_2 must be a valid URL").optional(),
    image_3: z.string().url("image_3 must be a valid URL").optional(),
});

export type UpdateStoreProductSchemaType = z.infer<typeof updateStoreProductSchema>;
