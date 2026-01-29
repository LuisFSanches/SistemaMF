export interface ISchedule {
    id: string;
    day_of_week: string;
    is_closed: boolean;
    opening_time: string | null;
    closing_time: string | null;
    lunch_break_start: string | null;
    lunch_break_end: string | null;
    created_at: string;
    updated_at: string;
}

export interface IStore {
    id: string;
    name: string;
    slug: string;
    cnpj?: string;
    phone_number: string;
    email: string;
    description?: string;
    mp_access_token?: string;
    mp_public_key?: string;
    mp_seller_id?: string;
    mp_webhook_secret?: string;
    inter_client_id?: string;
    inter_client_secret?: string;
    inter_api_cert_path?: string;
    inter_api_key_path?: string;
    payment_enabled: boolean;
    is_active: boolean;
    is_first_access: boolean;
    logo?: string;
    banner?: string;
    banner_2?: string;
    banner_3?: string;
    facebook?: string;
    instagram?: string;
    youtube?: string;
    schedules?: ISchedule[];
    created_at: string;
    updated_at: string;
}
