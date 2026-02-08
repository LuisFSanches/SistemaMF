import { z } from "zod";

const DayOfWeekEnum = z.enum(['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY']);

const timeRegex = /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/;

const scheduleSchema = z.object({
    day_of_week: DayOfWeekEnum,
    is_closed: z.boolean().default(false),
    opening_time: z.string().regex(timeRegex, "Invalid time format. Use HH:MM").nullable().optional(),
    closing_time: z.string().regex(timeRegex, "Invalid time format. Use HH:MM").nullable().optional(),
    lunch_break_start: z.string().regex(timeRegex, "Invalid time format. Use HH:MM").nullable().optional(),
    lunch_break_end: z.string().regex(timeRegex, "Invalid time format. Use HH:MM").nullable().optional(),
});

export const updateStoreSchedulesSchema = z.object({
    schedules: z.array(scheduleSchema).min(1, "At least one schedule is required"),
});

export type ScheduleItemType = z.infer<typeof scheduleSchema>;
export type UpdateStoreSchedulesSchemaType = z.infer<typeof updateStoreSchedulesSchema>;
