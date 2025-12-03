import { Request, Response, NextFunction } from 'express';
import { UpdateMultipleOrderDeliveriesService } from '../../services/orderDelivery/UpdateMultipleOrderDeliveriesService';

class UpdateMultipleOrderDeliveriesController {
    async handle(req: Request, res: Response, next: NextFunction) {
        const { ids, delivery_man_id, delivery_date, is_paid, is_archived } = req.body;

        const updateMultipleOrderDeliveriesService = new UpdateMultipleOrderDeliveriesService();

        const result = await updateMultipleOrderDeliveriesService.execute({
            ids,
            delivery_man_id,
            delivery_date: delivery_date ? new Date(delivery_date) : undefined,
            is_paid,
            is_archived
        });
        
        return res.json(result);
    }
}

export { UpdateMultipleOrderDeliveriesController };
