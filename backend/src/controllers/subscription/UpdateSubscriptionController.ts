import { Request, Response, NextFunction } from 'express';
import { UpdateSubscriptionService } from '../../services/subscription/UpdateSubscriptionService';

class UpdateSubscriptionController {
    async handle(req: Request, res: Response, next: NextFunction) {
        const { store_id } = req.params;
        const { subscription_plan_id, mp_subscription_id, status, start_date, end_date, next_billing_date, trial_end_date } = req.body;

        const updateSubscriptionService = new UpdateSubscriptionService();

        const updatedSubscription = await updateSubscriptionService.execute(store_id, {
            subscription_plan_id,
            mp_subscription_id,
            status,
            start_date,
            end_date,
            next_billing_date,
            trial_end_date
        });
        
        return res.json(updatedSubscription);
    }
}

export { UpdateSubscriptionController };