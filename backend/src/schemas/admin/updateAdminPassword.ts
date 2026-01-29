import { z } from "zod";

export const updateAdminPasswordSchema = z.object({
    admin_id: z.string().nonempty("admin_id is required"),
    new_password: z.string().min(6, "Password must be at least 6 characters"),
});

export type UpdateAdminPasswordSchemaType = z.infer<typeof updateAdminPasswordSchema>;
