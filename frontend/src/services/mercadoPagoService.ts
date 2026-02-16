import { api } from "./api";

interface IMercadoPagoItem {
    id: string;
    title: string;
    description?: string;
    picture_url?: string;
    quantity: number;
    unit_price: number;
}

interface IMercadoPagoPayer {
    name?: string;
    surname?: string;
    email?: string;
    phone?: {
        area_code: string;
        number: string;
    };
}

interface ICreatePreferenceData {
    order_id: string;
    store_slug: string;
    items: IMercadoPagoItem[];
    shipments?: {
        cost: number;
        mode: string;
    };
    payer?: IMercadoPagoPayer;
    back_urls?: {
        success: string;
        failure: string;
        pending: string;
    };
    auto_return?: 'approved' | 'all';
}

interface IPreferenceResponse {
    id: string;
    init_point: string;
    sandbox_init_point: string;
}

interface IPaymentDetails {
    id: number;
    status: string;
    status_detail: string;
    external_reference: string;
    transaction_amount: number;
    currency_id: string;
    payment_method_id: string;
    payment_type_id: string;
    date_approved: string;
    date_created: string;
    payer: {
        email: string;
        first_name: string;
        last_name: string;
    };
    order_code: string;
}

/**
 * Cria uma preferência de pagamento no Mercado Pago
 * @param data Dados para criar a preferência
 * @returns Resposta com ID da preferência e URLs de checkout
 */
export const createMercadoPagoPreference = async (data: ICreatePreferenceData): Promise<IPreferenceResponse> => {
    const response = await api.post<IPreferenceResponse>("/mercadopago/preference", data);
    return response.data;
};

/**
 * Consulta o status de um pagamento específico
 * @param paymentId ID do pagamento
 * @param storeSlug Slug da loja (opcional)
 * @returns Detalhes do pagamento
 */
export const getMercadoPagoPaymentStatus = async (
    paymentId: string,
    storeSlug?: string
): Promise<IPaymentDetails> => {
    const params = storeSlug ? `?store_slug=${storeSlug}` : "";
    const response = await api.get<IPaymentDetails>(`/mercadopago/payment/${paymentId}${params}`);
    return response.data;
};

export type { IMercadoPagoItem, IMercadoPagoPayer, ICreatePreferenceData, IPreferenceResponse, IPaymentDetails };
