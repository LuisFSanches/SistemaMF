import { z } from "zod";

export const updateSpecialDateSchema = z.object({
    name: z.string().min(1, "Name is required").max(120).optional(),
    date: z.coerce.date().optional(),
});
