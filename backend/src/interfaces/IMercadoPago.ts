export interface IMercadoPagoItem {
    id: string;
    title: string;
    description?: string;
    picture_url?: string;
    quantity: number;
    unit_price: number;
    currency_id?: string;
}

export interface IMercadoPagoPayer {
    name?: string;
    surname?: string;
    email?: string;
    phone?: {
        area_code?: string;
        number?: string;
    };
}

export interface ICreatePreference {
    order_id: string;
    store_slug: string;
    items: IMercadoPagoItem[];
    payer?: IMercadoPagoPayer;
    external_reference?: string;
    notification_url?: string;
    back_urls?: {
        success?: string;
        failure?: string;
        pending?: string;
    };
    shipments?: {
        cost: number;
        mode?: string;
    };
}

export interface IMercadoPagoPreferenceResponse {
    id: string;
    init_point: string;
    sandbox_init_point: string;
}

export interface IMercadoPagoPaymentNotification {
    id: string;
    live_mode: boolean;
    type: string;
    date_created: string;
    user_id: number;
    api_version: string;
    action: string;
    data: {
        id: string;
    };
}

export interface IMercadoPagoPayment {
    id: number;
    status: string;
    status_detail: string;
    external_reference: string;
    transaction_amount: number;
    currency_id: string;
    payer: {
        id: number;
        email: string;
        first_name?: string;
        last_name?: string;
    };
    payment_method_id: string;
    payment_type_id: string;
    date_approved?: string;
    date_created: string;
}
