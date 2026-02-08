import { z } from "zod";

export const requestPasswordResetSchema = z.object({
    email: z.string().email("Invalid email format"),
});

export type RequestPasswordResetSchemaType = z.infer<typeof requestPasswordResetSchema>;
