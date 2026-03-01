import { z } from "zod";

export const createStoreCarouselSchema = z.object({
    store_id: z.string().nonempty("store_id is required"),
    name: z.string().nonempty("name is required"),
    is_active: z.boolean().optional(),
    product_ids: z.array(z.string().nonempty("product_id cannot be empty")).min(1, "At least one product is required"),
});

export type CreateStoreCarouselSchemaType = z.infer<typeof createStoreCarouselSchema>;
