import { z } from "zod";

export const updateProductCategoriesSchema = z.object({
    product_id: z.string().uuid("Invalid product ID"),
    category_ids: z.array(z.string().uuid("Invalid category ID")).min(1, "At least one category is required"),
});

export type UpdateProductCategoriesSchemaType = z.infer<typeof updateProductCategoriesSchema>;
