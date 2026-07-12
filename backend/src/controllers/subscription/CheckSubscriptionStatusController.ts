import { Request, Response, NextFunction } from 'express';
import { CheckSubscriptionStatusService } from '../../services/subscription/CheckSubscriptionStatusService';

class CheckSubscriptionStatusController {
    async handle(req: Request, res: Response, next: NextFunction) {
        // Pegar store_id dos params ou do admin logado
        const storeId = req.params.store_id || req.admin?.store_id;
        
        if (!storeId) {
            return res.status(400).json({ error: 'Store ID is required' });
        }

        const checkSubscriptionStatusService = new CheckSubscriptionStatusService();

        const subscriptionStatus = await checkSubscriptionStatusService.execute(storeId);
        
        return res.json(subscriptionStatus);
    }
}

export { CheckSubscriptionStatusController };