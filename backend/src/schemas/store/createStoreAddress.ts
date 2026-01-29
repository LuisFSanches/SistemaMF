import { z } from "zod";

export const createStoreAddressSchema = z.object({
    store_id: z.string().uuid("Invalid store ID format"),
    street: z.string().nonempty("Street is required"),
    street_number: z.string().nonempty("Street number is required"),
    complement: z.string().optional(),
    neighborhood: z.string().nonempty("Neighborhood is required"),
    reference_point: z.string().optional(),
    city: z.string().nonempty("City is required"),
    state: z.string().nonempty("State is required"),
    postal_code: z.string().optional(),
    country: z.string().optional(),
    is_main: z.boolean().optional(),
});

export type CreateStoreAddressSchemaType = z.infer<typeof createStoreAddressSchema>;
