import { z } from "zod";

export const requestVerificationSchema = z.object({
    phone_number: z.string().nonempty("Phone number is required"),
    email: z.string().email("Invalid email format").nonempty("Email is required"),
});

export type RequestVerificationSchemaType = z.infer<typeof requestVerificationSchema>;
