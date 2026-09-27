import { z } from "zod";

export const createSpecialDateSchema = z.object({
    store_id: z.string().uuid().nullable().optional(),
    name: z.string().min(1, "Name is required").max(120),
    date: z.coerce.date(),
});
