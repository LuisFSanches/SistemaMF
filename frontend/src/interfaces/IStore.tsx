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
    created_at: string;
    updated_at: string;
}
