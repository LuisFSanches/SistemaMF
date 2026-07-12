import { Request, Response, NextFunction } from 'express';
import { GetSubscriptionPlanService } from '../../services/subscription/GetSubscriptionPlanService';

class GetSubscriptionPlanController {
    async handle(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;

        const getSubscriptionPlanService = new GetSubscriptionPlanService();

        const subscriptionPlan = await getSubscriptionPlanService.execute(id);
        
        return res.json(subscriptionPlan);
    }
}

export { GetSubscriptionPlanController };