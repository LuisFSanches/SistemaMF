import { Request, Response, NextFunction } from 'express';
import { CreateSubscriptionPlanService } from '../../services/subscription/CreateSubscriptionPlanService';

class CreateSubscriptionPlanController {
    async handle(req: Request, res: Response, next: NextFunction) {
        const { name, description, price, billing_cycle, mp_plan_id, is_active } = req.body;

        const createSubscriptionPlanService = new CreateSubscriptionPlanService();

        const subscriptionPlan = await createSubscriptionPlanService.execute({
            name,
            description,
            price,
            billing_cycle,
            mp_plan_id,
            is_active
        });
        
        return res.status(201).json(subscriptionPlan);
    }
}

export { CreateSubscriptionPlanController };