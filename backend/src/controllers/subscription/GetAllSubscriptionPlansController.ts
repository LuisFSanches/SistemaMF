import { Request, Response, NextFunction } from 'express';
import { GetAllSubscriptionPlansService } from '../../services/subscription/GetAllSubscriptionPlansService';

class GetAllSubscriptionPlansController {
    async handle(req: Request, res: Response, next: NextFunction) {
        console.log("[GetAllSubscriptionPlansController] Handling request to get all subscription plans...");
        const getAllSubscriptionPlansService = new GetAllSubscriptionPlansService();

        const subscriptionPlans = await getAllSubscriptionPlansService.execute();
        
        return res.json(subscriptionPlans);
    }
}

export { GetAllSubscriptionPlansController };