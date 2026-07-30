import { z } from "zod";

export const orderSearchFiltersSchema = z.object({
    query: z.string().trim().min(1).optional(),
    clientName: z.string().trim().min(1).optional(),
    orderCode: z.string().trim().min(1).optional(),
    phoneNumber: z.string().trim().min(1).optional(),
    productName: z.string().trim().min(1).optional(),
});

export type OrderSearchFiltersSchemaType = z.infer<typeof orderSearchFiltersSchema>;
