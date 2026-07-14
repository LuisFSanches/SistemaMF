import { api } from "./api";
import { ICreateCouponData, CouponStatus } from "../interfaces/coupon";

export const createCoupon = async (data: ICreateCouponData) => {
    const response = await api.post("/admin/coupons", data);
    return response;
};

export const listCoupons = async (
    page?: number,
    limit?: number,
    status?: CouponStatus,
    search?: string
) => {
    const params = new URLSearchParams();
    if (page) params.append("page", page.toString());
    if (limit) params.append("limit", limit.toString());
    if (status) params.append("status", status);
    if (search) params.append("search", search);

    const response = await api.get(`/admin/coupons?${params.toString()}`);
    return response;
};

export const getCouponDetails = async (id: string) => {
    const response = await api.get(`/admin/coupons/${id}`);
    return response;
};

export const updateCoupon = async (id: string, data: Partial<ICreateCouponData>) => {
    const response = await api.put(`/admin/coupons/${id}`, data);
    return response;
};

export const deleteCoupon = async (id: string) => {
    const response = await api.delete(`/admin/coupons/${id}`);
    return response;
};

export const getCouponUsageHistory = async (
    id: string,
    page?: number,
    limit?: number
) => {
    const params = new URLSearchParams();
    if (page) params.append("page", page.toString());
    if (limit) params.append("limit", limit.toString());

    const response = await api.get(`/admin/coupons/${id}/history?${params.toString()}`);
    return response;
};

export const searchCoupons = async (query: string, limit: number = 10) => {
    const params = new URLSearchParams();
    params.append("search", query);
    params.append("limit", limit.toString());

    const response = await api.get(`/admin/coupons/search?${params.toString()}`);
    return response;
};

export const validateCoupon = async (data: {
    code: string;
    store_id: string;
    customerId?: string;
    orderTotal: number;
}) => {
    const response = await api.post("/store/coupons/validate", data);
    return response;
};

/**
 * TypeScript interfaces for coupon validation
 */
export interface ICouponValidationResponse {
    valid: boolean;
    discount_amount?: number;
    error_code?: string;
    error_message?: string;
    coupon?: {
        id: string;
        code: string;
        discount_type: string;
        discount_value: number;
    };
}

export interface IAppliedCoupon {
    code: string;
    coupon_id: string;
    discount_amount: number;
}

/**
 * Maps error codes to user-friendly Portuguese messages
 */
export function getCouponErrorMessage(errorCode?: string): string {
    const errorMessages: Record<string, string> = {
        'NOT_FOUND': 'Cupom não encontrado',
        'INACTIVE': 'Cupom inativo',
        'EXPIRED': 'Cupom expirado',
        'NOT_STARTED': 'Cupom ainda não está válido',
        'USAGE_LIMIT_REACHED': 'Limite de uso do cupom atingido',
        'CUSTOMER_NOT_ALLOWED': 'Cupom não disponível para sua conta',
        'CUSTOMER_LIMIT_REACHED': 'Você já atingiu o limite de uso deste cupom',
        'MINIMUM_NOT_MET': 'Valor mínimo do pedido não atingido',
        'NETWORK_ERROR': 'Erro de conexão. Tente novamente.',
        'UNKNOWN_ERROR': 'Erro desconhecido ao validar cupom'
    };
    
    return errorMessages[errorCode || 'UNKNOWN_ERROR'] || 'Erro ao validar cupom';
}
