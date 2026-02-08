import { z } from "zod";

export const updateAdminEmailSchema = z.object({
    email: z.string().email("Invalid email format"),
    current_password: z.string().nonempty("current_password is required"),
});

export type UpdateAdminEmailSchemaType = z.infer<typeof updateAdminEmailSchema>;
