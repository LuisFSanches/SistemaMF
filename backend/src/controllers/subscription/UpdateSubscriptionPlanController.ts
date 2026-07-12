import { Request, Response, NextFunction } from 'express';
import { UpdateSubscriptionPlanService } from '../../services/subscription/UpdateSubscriptionPlanService';

class UpdateSubscriptionPlanController {
    async handle(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;
        const { name, description, price, billing_cycle, mp_plan_id, is_active } = req.body;

        const updateSubscriptionPlanService = new UpdateSubscriptionPlanService();

        const updatedPlan = await updateSubscriptionPlanService.execute(id, {
            name,
            description,
            price,
            billing_cycle,
            mp_plan_id,
            is_active
        });
        
        return res.json(updatedPlan);
    }
}

export { UpdateSubscriptionPlanController };