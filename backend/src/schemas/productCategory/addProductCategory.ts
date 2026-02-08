import { z } from "zod";

export const addProductCategorySchema = z.object({
    product_id: z.string().uuid("Invalid product ID"),
    category_id: z.string().uuid("Invalid category ID"),
});

export type AddProductCategorySchemaType = z.infer<typeof addProductCategorySchema>;
