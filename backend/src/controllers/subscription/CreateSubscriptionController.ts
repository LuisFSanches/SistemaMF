import { Request, Response, NextFunction } from 'express';
import { CreateSubscriptionService } from '../../services/subscription/CreateSubscriptionService';

class CreateSubscriptionController {
    async handle(req: Request, res: Response, next: NextFunction) {
        const { store_id, subscription_plan_id, mp_subscription_id, status, start_date, end_date, trial_end_date } = req.body;

        const createSubscriptionService = new CreateSubscriptionService();

        const subscription = await createSubscriptionService.execute({
            store_id,
            subscription_plan_id,
            mp_subscription_id,
            status,
            start_date,
            end_date,
            trial_end_date
        });
        
        return res.status(201).json(subscription);
    }
}

export { CreateSubscriptionController };