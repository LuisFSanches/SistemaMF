import { z } from "zod";

export const validateCodeSchema = z.object({
    phone_number: z.string().nonempty("Phone number is required"),
    code: z.string().length(6, "Code must be exactly 6 characters"),
});

export type ValidateCodeSchemaType = z.infer<typeof validateCodeSchema>;
