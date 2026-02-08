import { Request, Response, NextFunction } from 'express';
import { GetOrderDeliveryService } from '../../services/orderDelivery/GetOrderDeliveryService';

class GetOrderDeliveryController {
    async handle(req: Request, res: Response, next: NextFunction) {
        const store_id = req.admin?.store_id || undefined;
        const { id } = req.params;

        const getOrderDeliveryService = new GetOrderDeliveryService();

        const orderDelivery = await getOrderDeliveryService.execute({ id, store_id });
        
        return res.json(orderDelivery);
    }
}

export { GetOrderDeliveryController };
