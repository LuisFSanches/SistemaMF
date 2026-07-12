import { api } from "./api";
import { 
    ISubscriptionPlan, 
    ISubscriptionStatus, 
    ICreateSubscriptionData, 
    IBillingInfo,
} from "../interfaces/ISubscription";

// ==================== PLANOS ====================

/**
 * Lista todos os planos disponíveis (público)
 */
export const getPublicPlans = async () => {
    return api.get<ISubscriptionPlan[]>("/subscription/public/plans");
};

/**
 * Lista todos os planos (SYS_ADMIN apenas)
 */
export const getAllPlans = async () => {
    return api.get<ISubscriptionPlan[]>("/subscription/plans");
};

/**
 * Busca um plano específico por ID
 */
export const getPlanById = async (id: string) => {
    return api.get<ISubscriptionPlan>(`/subscription/plans/${id}`);
};

/**
 * Cria um novo plano (SYS_ADMIN apenas)
 */
export const createPlan = async (planData: Partial<ISubscriptionPlan>) => {
    return api.post<ISubscriptionPlan>("/subscription/plans", planData);
};

/**
 * Atualiza um plano existente (SYS_ADMIN apenas)
 */
export const updatePlan = async (id: string, planData: Partial<ISubscriptionPlan>) => {
    return api.put<ISubscriptionPlan>(`/subscription/plans/${id}`, planData);
};

/**
 * Desativa um plano (SYS_ADMIN apenas)
 */
export const deletePlan = async (id: string) => {
    return api.delete(`/subscription/plans/${id}`);
};

// ==================== ASSINATURAS ====================

/**
 * Verifica o status da assinatura da loja atual
 */
export const getSubscriptionStatus = async () => {
    return {
        data: {
            is_active: true,
            is_trial: true,
            days_remaining: 2,
        }
    }
     //api.get<ISubscriptionStatus>("/subscription/status");
};

/**
 * Cria uma nova assinatura
 */
export const createSubscription = async (data: ICreateSubscriptionData) => {
    return api.post("/subscription", data);
};

/**
 * Cancela a assinatura da loja
 */
export const cancelSubscription = async (storeId: string) => {
    return api.delete(`/subscription/${storeId}`);
};

// ==================== COBRANÇA E FATURAMENTO ====================

/**
 * Obtém o resumo completo de faturamento da loja
 * Inclui: status da assinatura, cobranças do mês atual, histórico e próxima fatura
 */
export const getBillingInfo = async () => {
    return api.get<IBillingInfo>("/subscription/billing");
};
