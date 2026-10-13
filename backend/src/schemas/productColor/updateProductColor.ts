import { z } from "zod";

export const updateProductColorSchema = z.object({
    name: z.string().trim().nonempty("Color name is required").optional(),
    hex: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Hex must be in the format #RRGGBB").nullable().optional(),
    is_mixed: z.boolean().optional(),
    sort_order: z.number().int().optional(),
});

export type UpdateProductColorSchemaType = z.infer<typeof updateProductColorSchema>;
