export interface IStore {
    id?: string;
    name: string;
    slug: string;
    cnpj?: string;
    phone_number: string;
    email: string;
    description?: string;
    
    // Credenciais Mercado Pago
    mp_access_token?: string;
    mp_public_key?: string;
    mp_seller_id?: string;
    mp_webhook_secret?: string;
    
    // Credenciais Banco Inter
    inter_client_id?: string;
    inter_client_secret?: string;
    inter_api_cert_path?: string;
    inter_api_key_path?: string;
    
    // Configurações
    payment_enabled?: boolean;
    is_active?: boolean;
    is_first_access?: boolean;
    logo?: string;
    banner?: string;
    
    created_at?: Date;
    updated_at?: Date;
}

export interface IStoreAddress {
    id?: string;
    store_id: string;
    street: string;
    street_number: string;
    complement?: string;
    neighborhood: string;
    reference_point?: string;
    city: string;
    state: string;
    postal_code?: string;
    country?: string;
    is_main?: boolean;
    created_at?: Date;
    updated_at?: Date;
}

export interface IStoreSchedule {
    id?: string;
    store_id: string;
    day_of_week: 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY' | 'SATURDAY' | 'SUNDAY';
    is_closed?: boolean;
    opening_time?: string;  // Formato: "HH:MM"
    closing_time?: string;  // Formato: "HH:MM"
    lunch_break_start?: string;  // Formato: "HH:MM"
    lunch_break_end?: string;  // Formato: "HH:MM"
    created_at?: Date;
    updated_at?: Date;
}

export interface IStoreHoliday {
    id?: string;
    store_id: string;
    date: Date | string;
    name: string;
    description?: string;
    is_closed?: boolean;
    created_at?: Date;
    updated_at?: Date;
}

export interface IStoreCredentials {
    store_id: string;
    
    // Credenciais Mercado Pago (opcionais)
    mp_access_token?: string;
    mp_public_key?: string;
    mp_seller_id?: string;
    mp_webhook_secret?: string;
    
    // Credenciais Banco Inter (opcionais)
    inter_client_id?: string;
    inter_client_secret?: string;
    inter_api_cert_path?: string;
    inter_api_key_path?: string;
    
    payment_enabled?: boolean;
}
