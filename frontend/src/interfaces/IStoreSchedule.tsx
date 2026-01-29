export type DayOfWeek = 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY' | 'SATURDAY' | 'SUNDAY';

export interface IStoreSchedule {
    id: string;
    store_id: string;
    day_of_week: DayOfWeek;
    is_closed: boolean;
    opening_time?: string;
    closing_time?: string;
    lunch_break_start?: string;
    lunch_break_end?: string;
    created_at: Date;
    updated_at: Date;
}

export interface ICreateStoreSchedule {
    store_id: string;
    day_of_week: DayOfWeek;
    is_closed: boolean;
    opening_time?: string;
    closing_time?: string;
    lunch_break_start?: string;
    lunch_break_end?: string;
}

export interface IUpdateStoreSchedule {
    day_of_week?: DayOfWeek;
    is_closed?: boolean;
    opening_time?: string;
    closing_time?: string;
    lunch_break_start?: string;
    lunch_break_end?: string;
}
