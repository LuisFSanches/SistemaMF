import { z } from "zod";

export const createSupplierSchema = z.object({
    name: z.string().nonempty("Supplier name is required").trim(),
});

export type CreateSupplierSchemaType = z.infer<typeof createSupplierSchema>;
