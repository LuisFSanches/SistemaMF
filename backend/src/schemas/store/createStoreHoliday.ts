import { z } from "zod";

export const createStoreHolidaySchema = z.object({
    store_id: z.string().uuid("Invalid store ID format"),
    date: z.string().or(z.date()).transform((val) => {
        if (typeof val === 'string') {
            return new Date(val);
        }
        return val;
    }),
    name: z.string().nonempty("Holiday name is required"),
    description: z.string().optional(),
    is_closed: z.boolean().optional(),
});

export type CreateStoreHolidaySchemaType = z.infer<typeof createStoreHolidaySchema>;
