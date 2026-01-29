import { z } from "zod";

export const createAdminSchema = z.object({
    username: z.string().nonempty("username is required"),
    name: z.string().nonempty("name is required"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    role: z.string().nonempty("role is required"),
    email: z.string().email("Invalid email format").optional(),
    store_id: z.string().optional(),
}).refine((data) => {
    // Se o role for SUPER_ADMIN, o email é obrigatório
    if (data.role === 'SUPER_ADMIN' && !data.email) {
        return false;
    }
    return true;
}, {
    message: "Email is required for SUPER_ADMIN",
    path: ["email"]
});

export type CreateAdminSchemaType = z.infer<typeof createAdminSchema>;
