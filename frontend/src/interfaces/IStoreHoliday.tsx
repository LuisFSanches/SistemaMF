export interface IStoreHoliday {
    id: string;
    store_id: string;
    date: Date;
    name: string;
    description?: string;
    is_closed: boolean;
    created_at: Date;
    updated_at: Date;
}

export interface ICreateStoreHoliday {
    store_id: string;
    date: string;
    name: string;
    description?: string;
    is_closed?: boolean;
}

export interface IUpdateStoreHoliday {
    date?: string;
    name?: string;
    description?: string;
    is_closed?: boolean;
}
