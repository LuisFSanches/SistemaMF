import { z } from "zod";

const DayOfWeekEnum = z.enum(['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY']);

const timeRegex = /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/;

export const createStoreScheduleSchema = z.object({
    store_id: z.string().uuid("Invalid store ID format"),
    day_of_week: DayOfWeekEnum,
    is_closed: z.boolean().optional(),
    opening_time: z.string().regex(timeRegex, "Invalid time format. Use HH:MM").optional(),
    closing_time: z.string().regex(timeRegex, "Invalid time format. Use HH:MM").optional(),
    lunch_break_start: z.string().regex(timeRegex, "Invalid time format. Use HH:MM").optional(),
    lunch_break_end: z.string().regex(timeRegex, "Invalid time format. Use HH:MM").optional(),
}).refine(
    (data) => {
        if (data.is_closed) return true;
        return data.opening_time && data.closing_time;
    },
    {
        message: "Opening and closing times are required when store is not closed",
        path: ["opening_time"],
    }
);

export type CreateStoreScheduleSchemaType = z.infer<typeof createStoreScheduleSchema>;
