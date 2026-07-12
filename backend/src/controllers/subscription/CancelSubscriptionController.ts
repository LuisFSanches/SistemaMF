import { Request, Response, NextFunction } from 'express';
import { CancelSubscriptionService } from '../../services/subscription/CancelSubscriptionService';

class CancelSubscriptionController {
    async handle(req: Request, res: Response, next: NextFunction) {
        const { store_id } = req.params;

        const cancelSubscriptionService = new CancelSubscriptionService();

        const cancelledSubscription = await cancelSubscriptionService.execute(store_id);
        
        return res.json(cancelledSubscription);
    }
}

export { CancelSubscriptionController };