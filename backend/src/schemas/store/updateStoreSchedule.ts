import { z } from "zod";

const DayOfWeekEnum = z.enum(['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY']);

const timeRegex = /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/;

export const updateStoreScheduleSchema = z.object({
    day_of_week: DayOfWeekEnum.optional(),
    is_closed: z.boolean().optional(),
    opening_time: z.string().regex(timeRegex, "Invalid time format. Use HH:MM").optional(),
    closing_time: z.string().regex(timeRegex, "Invalid time format. Use HH:MM").optional(),
    lunch_break_start: z.string().regex(timeRegex, "Invalid time format. Use HH:MM").optional(),
    lunch_break_end: z.string().regex(timeRegex, "Invalid time format. Use HH:MM").optional(),
});

export type UpdateStoreScheduleSchemaType = z.infer<typeof updateStoreScheduleSchema>;
