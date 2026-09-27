export interface ISpecialDate {
    id: string;
    store_id?: string | null;
    name: string;
    date: string | Date;
    created_at?: string | Date;
    updated_at?: string | Date;
}

export interface ICreateSpecialDateData {
    name: string;
    date: string | Date;
}
