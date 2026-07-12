import prismaClient from "../prisma";
import { UnauthorizedRequestException } from "../exceptions/unauthorized";
import { ErrorCodes } from "../exceptions/root";

interface Store {
    id: string;
    created_at: Date;
    trial_end_date: Date | null;
}

/**
 * Valida se a loja tem uma assinatura ativa ou está no período de trial válido.
 * Lança exceção se a assinatura estiver inativa ou trial expirado.
 * 
 * @param store - Dados da loja a ser validada
 * @param throwError - Se true, lança exceção. Se false, apenas retorna boolean
 * @returns true se assinatura válida, false caso contrário
 */
export async function validateSubscription(
    store: Store,
    throwError: boolean = true
): Promise<boolean> {
    const storeId = store.id;
    
    // Buscar assinatura da loja
    const subscription = await prismaClient.subscription.findUnique({
        where: { store_id: storeId },
        include: {
            subscriptionPlan: true
        }
    });

    const now = new Date();
    let isActive = false;

    console.log('subscription:', subscription);

    // Caso não tenha assinatura - verificar trial
    if (!subscription) {
        const trialEndDate = store.trial_end_date || new Date(store.created_at.getTime() + 7 * 24 * 60 * 60 * 1000);
        const isTrialExpired = now > trialEndDate;
        isActive = !isTrialExpired;

        if (!isActive && throwError) {
            throw new UnauthorizedRequestException(
                'Trial period expired. Please subscribe to a plan to continue using the system.',
                ErrorCodes.UNAUTHORIZED
            );
        }
    } else {
        // Verificar status da assinatura
        switch (subscription.status) {
            case 'ACTIVE':
                isActive = true;
                break;
            
            case 'PENDING':
                // Se está PENDING mas tem trial válido, permitir
                if (subscription.trial_end_date && now <= subscription.trial_end_date) {
                    isActive = true;
                }
                break;
            
            case 'EXPIRED':
            case 'CANCELLED':
                isActive = false;
                break;
        }

        if (!isActive && throwError) {
            throw new UnauthorizedRequestException(
                'Subscription is inactive. Please renew your subscription to continue using the system.',
                ErrorCodes.UNAUTHORIZED
            );
        }
    }

    return isActive;
}

/**
 * Verifica se a rota atual é uma rota de gestão de assinatura
 * que não deve ter validação de assinatura bloqueante.
 */
export function isSubscriptionManagementRoute(path: string): boolean {
    const subscriptionManagementRoutes = [
        '/subscription/status',
        '/subscription/billing',
        '/subscription'
    ];
    
    return subscriptionManagementRoutes.some(route => 
        path === route || path.startsWith(route + '/')
    );
}
