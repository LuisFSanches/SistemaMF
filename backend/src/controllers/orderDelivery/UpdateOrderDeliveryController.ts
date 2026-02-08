import { Request, Response, NextFunction } from 'express';
import { UpdateOrderDeliveryService } from '../../services/orderDelivery/UpdateOrderDeliveryService';

class UpdateOrderDeliveryController {
    async handle(req: Request, res: Response, next: NextFunction) {
        const store_id = req.admin?.store_id || undefined;
        const { id } = req.params;
        const { delivery_man_id, delivery_date, is_paid, is_archived } = req.body;

        const updateOrderDeliveryService = new UpdateOrderDeliveryService();

        const orderDelivery = await updateOrderDeliveryService.execute({
            id,
            delivery_man_id,
            delivery_date: delivery_date ? new Date(delivery_date) : undefined,
            is_paid,
            is_archived
        }, store_id);
        
        return res.json(orderDelivery);
    }
}

export { UpdateOrderDeliveryController };
