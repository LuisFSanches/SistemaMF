export interface IOrderInfo {
    order_id: number;
    order_code: string;
    status: 'approved' | 'pending' | 'in_progress' | 'in_delivery' | 'done' | 'failure';
    created_at: string;
}

export interface IOrderItem {
    id: string;
    product_id: string | null;
    product_name: string;
    quantity: number;
    unit_price: number;
    total_price: number;
    image_url?: string | null;
    description?: string | null;
}

export interface IFinancialInfo {
    subtotal: number;
    delivery_fee: number;
    discount?: number;
    total_amount: number;
}

export interface IDeliveryAddress {
    street: string;
    number: string;
    complement?: string | null;
    neighborhood: string;
    city: string;
    state: string;
    zip_code?: string | null;
    reference?: string | null;
}

export interface IDeliveryInfo {
    type: string;
    is_pickup: boolean;
    address: IDeliveryAddress | null;
    delivery_date: string;
    receiver_name: string;
    receiver_phone: string;
}

export interface IPaymentPayer {
    email: string;
    first_name: string;
    last_name: string;
}

export interface IPaymentInfo {
    id: string;
    method_id: string;
    method_type: string;
    payment_brand: string;
    status: string;
    status_detail: string;
    transaction_amount: number;
    currency_id: string;
    date_approved: string | null;
    date_created: string;
    payer: IPaymentPayer | null;
}

export interface ICardMessage {
    has_card: boolean;
    message?: string;
    from?: string;
    to?: string;
}

export interface IAdditionalInfo {
    notes?: string | null;
    description?: string | null;
    card_message: ICardMessage;
}

export interface IClientInfo {
    first_name: string;
    last_name: string;
    phone_number: string;
    email: string | null;
}

export interface IStoreInfo {
    name: string;
    slug: string;
    phone_number: string;
    email: string;
}

export interface IPaymentSuccessResponse {
    order: IOrderInfo;
    items: IOrderItem[];
    financial: IFinancialInfo;
    delivery: IDeliveryInfo;
    payment: IPaymentInfo;
    additional_info: IAdditionalInfo;
    client: IClientInfo;
    store: IStoreInfo;
}
