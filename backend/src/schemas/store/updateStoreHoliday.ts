import { z } from "zod";

export const updateStoreHolidaySchema = z.object({
    date: z.string().or(z.date()).transform((val) => {
        if (typeof val === 'string') {
            return new Date(val);
        }
        return val;
    }).optional(),
    name: z.string().optional(),
    description: z.string().optional(),
    is_closed: z.boolean().optional(),
});

export type UpdateStoreHolidaySchemaType = z.infer<typeof updateStoreHolidaySchema>;
