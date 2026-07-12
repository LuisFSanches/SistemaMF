import { Request, Response, NextFunction } from 'express';
import { CheckSubscriptionStatusService } from '../../services/subscription/CheckSubscriptionStatusService';

class GetStoreSubscriptionBillingController {
    async handle(req: Request, res: Response, next: NextFunction) {
        // Pegar store_id do admin logado
        const storeId = req.admin?.store_id;
        
        if (!storeId) {
            return res.status(400).json({ error: 'Store ID is required' });
        }

        const checkSubscriptionStatusService = new CheckSubscriptionStatusService();

        // Buscar status da assinatura
        const subscriptionStatus = await checkSubscriptionStatusService.execute(storeId);
        
        // Buscar resumo de cobranças do mês atual
        const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM

        // Calcular próxima fatura (assinatura + cobranças pendentes)
        let nextBillAmount = 0;
        if (subscriptionStatus.current_plan) {
            nextBillAmount += subscriptionStatus.current_plan.price;
        }

        const billingDetails = {
            subscription_status: subscriptionStatus,
            next_bill: {
                amount: nextBillAmount,
                due_date: subscriptionStatus.next_billing_date,
                includes_subscription: subscriptionStatus.current_plan ? subscriptionStatus.current_plan.price : 0,
            }
        };
        
        return res.json(billingDetails);
    }
}

export { GetStoreSubscriptionBillingController };