import { z } from "zod";

export const createClientSchema = z.object({
    first_name: z.string().nonempty("first_name is required"),
    last_name: z.string().nonempty("last_name is required"),
    phone_number: z.string().nonempty("phone_number is required"),
    email: z.string().email("Invalid email format").optional(),
});
