import { z } from "zod";

export const updateStoreAddressSchema = z.object({
    street: z.string().optional(),
    street_number: z.string().optional(),
    complement: z.string().optional(),
    neighborhood: z.string().optional(),
    reference_point: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    postal_code: z.string().optional(),
    country: z.string().optional(),
    is_main: z.boolean().optional(),
});

export type UpdateStoreAddressSchemaType = z.infer<typeof updateStoreAddressSchema>;
