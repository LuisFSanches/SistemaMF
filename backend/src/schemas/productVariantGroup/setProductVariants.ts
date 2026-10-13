import { z } from "zod";

export const productVariantItemSchema = z.object({
    product_id: z.string().nonempty("product_id is required"),
    color_id: z.string().nonempty("color_id is required"),
    variant_order: z.number().int().optional(),
});

export const setProductVariantsSchema = z.object({
    variants: z.array(productVariantItemSchema)
        .refine(items => new Set(items.map(item => item.product_id)).size === items.length, {
            message: "The same product cannot be added twice to a group",
        })
        .refine(items => new Set(items.map(item => item.color_id)).size === items.length, {
            message: "Each color can only be used once per group",
        }),
});

export type SetProductVariantsSchemaType = z.infer<typeof setProductVariantsSchema>;
