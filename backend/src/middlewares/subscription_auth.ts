import { NextFunction, Request, Response } from "express";
import { UnauthorizedRequestException } from "../exceptions/unauthorized";
import { ErrorCodes } from "../exceptions/root";
import { CheckSubscriptionStatusService } from "../services/subscription/CheckSubscriptionStatusService";

const subscriptionAuthMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Verificar se o admin está autenticado (req.admin deve existir)
        if (!req.admin || !req.admin.store_id) {
            return next(new UnauthorizedRequestException(
                'Admin authentication required',
                ErrorCodes.UNAUTHORIZED
            ));
        }

        const storeId = req.admin.store_id;
        
        // Verificar status da assinatura
        const checkSubscriptionStatusService = new CheckSubscriptionStatusService();
        const subscriptionStatus = await checkSubscriptionStatusService.execute(storeId);

        // Verificar se a assinatura está ativa ou em período trial
        if (!subscriptionStatus.is_active) {
            return next(new UnauthorizedRequestException(
                'Store subscription is inactive. Please renew your subscription to continue using this feature.',
                ErrorCodes.UNAUTHORIZED
            ));
        }

        // Se chegou aqui, a assinatura está ativa
        // Adicionar informações da assinatura ao request para uso posterior se necessário
        req.subscription_status = subscriptionStatus;
        
        next();
    } catch (error) {
        console.error('[subscriptionAuthMiddleware] Error:', error);
        
        next(new UnauthorizedRequestException(
            'Subscription verification failed',
            ErrorCodes.UNAUTHORIZED
        ));
    }
}

export default subscriptionAuthMiddleware;