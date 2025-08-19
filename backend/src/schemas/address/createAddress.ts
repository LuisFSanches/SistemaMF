import { z } from "zod";

export const createAddressSchema = z.object({
    client_id: z.string().nonempty("client_id is required"),
    street: z.string().nonempty("street is required"),
    street_number: z.string().nonempty("street_number is required"),
    complement: z.string().optional(),
    reference_point: z.string().optional(),
    neighborhood: z.string().nonempty("neighborhood is required"),
    city: z.string().nonempty("city is required"),
    state: z.string().nonempty("state is required"),
    postal_code: z.string().optional(),
    country: z.string().nonempty("country is required"),
});
