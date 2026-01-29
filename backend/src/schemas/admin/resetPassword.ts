import { z } from "zod";

export const resetPasswordSchema = z.object({
    token: z.string().nonempty("Token is required"),
    new_password: z.string().min(6, "Password must be at least 6 characters"),
});

export type ResetPasswordSchemaType = z.infer<typeof resetPasswordSchema>;
