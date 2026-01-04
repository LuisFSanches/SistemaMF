import { Request, Response, NextFunction } from 'express';
import { CreateOrderDeliveryService } from '../../services/orderDelivery/CreateOrderDeliveryService';
import { orderEmitter, OrderEvents } from '../../events/orderEvents';

class CreateOrderDeliveryController {
    async handle(req: Request, res: Response, next: NextFunction) {
        const { order_id, delivery_man_id, delivery_date, is_paid, is_archived, store_id } = req.body;
        const createOrderDeliveryService = new CreateOrderDeliveryService();

        const orderDelivery = await createOrderDeliveryService.execute({
            order_id,
            delivery_man_id,
            delivery_date: new Date(delivery_date),
            is_paid,
            is_archived
        }, store_id);

        orderEmitter.emit(OrderEvents.orderDelivered, orderDelivery);
        
        return res.json(orderDelivery);
    }
}

export { CreateOrderDeliveryController };
