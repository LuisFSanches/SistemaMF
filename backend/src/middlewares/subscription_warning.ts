import { NextFunction, Request, Response } from "express";
import { CheckSubscriptionStatusService } from "../services/subscription/CheckSubscriptionStatusService";

const subscriptionWarningMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Apenas adicionar informações da assinatura ao request se admin existe
        if (req.admin && req.admin.store_id) {
            const storeId = req.admin.store_id;
            
            const checkSubscriptionStatusService = new CheckSubscriptionStatusService();
            const subscriptionStatus = await checkSubscriptionStatusService.execute(storeId);

            // Adicionar informações da assinatura ao request
            req.subscription_status = subscriptionStatus;
            
            // Se está no trial ou próximo do vencimento, adicionar warning no header da response
            if (subscriptionStatus.is_trial && subscriptionStatus.days_remaining !== undefined) {
                res.setHeader('X-Subscription-Warning', `Trial period: ${subscriptionStatus.days_remaining} days remaining`);
                res.setHeader('X-Subscription-Status', 'trial');
            } else if (!subscriptionStatus.is_active) {
                res.setHeader('X-Subscription-Warning', 'Subscription expired or inactive');
                res.setHeader('X-Subscription-Status', 'inactive');
            } else {
                res.setHeader('X-Subscription-Status', 'active');
            }
        }
        
        next();
    } catch (error) {
        console.error('[subscriptionWarningMiddleware] Error:', error);
        // Em caso de erro, continuar sem bloquear
        next();
    }
}

export default subscriptionWarningMiddleware;