import { Request, Response, NextFunction } from 'express';
import { DeleteSubscriptionPlanService } from '../../services/subscription/DeleteSubscriptionPlanService';

class DeleteSubscriptionPlanController {
    async handle(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;

        const deleteSubscriptionPlanService = new DeleteSubscriptionPlanService();

        const deletedPlan = await deleteSubscriptionPlanService.execute(id);
        
        return res.json(deletedPlan);
    }
}

export { DeleteSubscriptionPlanController };