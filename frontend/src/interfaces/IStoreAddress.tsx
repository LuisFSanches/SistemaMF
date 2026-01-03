export interface IStoreAddress {
    id: string;
    store_id: string;
    street: string;
    street_number: string;
    complement?: string;
    neighborhood: string;
    reference_point?: string;
    city: string;
    state: string;
    postal_code?: string;
    country: string;
    is_main: boolean;
    created_at: Date;
    updated_at: Date;
}

export interface ICreateStoreAddress {
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
}

export interface IUpdateStoreAddress {
    street?: string;
    street_number?: string;
    complement?: string;
    neighborhood?: string;
    reference_point?: string;
    city?: string;
    state?: string;
    postal_code?: string;
    country?: string;
    is_main?: boolean;
}
