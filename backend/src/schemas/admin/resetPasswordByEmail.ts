import { z } from "zod";

export const resetPasswordByEmailSchema = z.object({
    email: z.string().email("Invalid email format"),
    new_password: z.string().min(6, "Password must be at least 6 characters"),
});

export type ResetPasswordByEmailSchemaType = z.infer<typeof resetPasswordByEmailSchema>;
