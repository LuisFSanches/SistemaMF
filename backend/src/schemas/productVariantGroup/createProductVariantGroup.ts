import { z } from "zod";
import { setProductVariantsSchema } from "./setProductVariants";

export const createProductVariantGroupSchema = z.object({
    name: z.string().trim().nonempty("Group name is required"),
    description: z.string().nullable().optional(),
    variants: setProductVariantsSchema.shape.variants.optional(),
});

export type CreateProductVariantGroupSchemaType = z.infer<typeof createProductVariantGroupSchema>;
