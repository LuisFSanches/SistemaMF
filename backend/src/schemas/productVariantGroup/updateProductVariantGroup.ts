import { z } from "zod";

export const updateProductVariantGroupSchema = z.object({
    name: z.string().trim().nonempty("Group name is required").optional(),
    description: z.string().nullable().optional(),
});

export type UpdateProductVariantGroupSchemaType = z.infer<typeof updateProductVariantGroupSchema>;
