import { z } from "zod";

export const updateStoreCarouselSchema = z.object({
    name: z.string().nonempty("name cannot be empty").optional(),
    is_active: z.boolean().optional(),
    product_ids: z.array(z.string().nonempty("product_id cannot be empty")).min(1, "At least one product is required").optional(),
});

export type UpdateStoreCarouselSchemaType = z.infer<typeof updateStoreCarouselSchema>;
