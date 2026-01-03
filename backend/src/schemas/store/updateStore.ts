import { z } from "zod";

export const updateStoreSchema = z.object({
    name: z.string().optional(),
    slug: z.string().regex(/^[a-z0-9-]+$/, "Slug must contain only lowercase letters, numbers and hyphens").optional(),
    cnpj: z.string().optional(),
    phone_number: z.string().optional(),
    email: z.string().email("Invalid email format").optional(),
    description: z.string().optional(),
    is_active: z.boolean().optional(),
    is_first_access: z.boolean().optional(),
});

export type UpdateStoreSchemaType = z.infer<typeof updateStoreSchema>;
