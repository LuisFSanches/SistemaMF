import { z } from "zod";

export const createStoreSchema = z.object({
    name: z.string().nonempty("Name is required"),
    slug: z.string().nonempty("Slug is required").regex(/^[a-z0-9-]+$/, "Slug must contain only lowercase letters, numbers and hyphens"),
    cnpj: z.string().optional(),
    phone_number: z.string().nonempty("Phone number is required"),
    email: z.string().email("Invalid email format"),
    description: z.string().optional(),
    is_active: z.boolean().optional(),
});

export type CreateStoreSchemaType = z.infer<typeof createStoreSchema>;

