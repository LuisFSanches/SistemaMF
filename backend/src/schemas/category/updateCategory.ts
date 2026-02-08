import { z } from "zod";

export const updateCategorySchema = z.object({
    name: z.string().nonempty("Category name is required").optional(),
    slug: z.string().nonempty("Category slug is required").optional(),
});

export type UpdateCategorySchemaType = z.infer<typeof updateCategorySchema>;
