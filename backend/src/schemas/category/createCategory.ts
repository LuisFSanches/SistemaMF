import { z } from "zod";

export const createCategorySchema = z.object({
    name: z.string().nonempty("Category name is required"),
    slug: z.string().nonempty("Category slug is required"),
});

export type CreateCategorySchemaType = z.infer<typeof createCategorySchema>;
