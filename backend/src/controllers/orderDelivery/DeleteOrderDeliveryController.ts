import { Request, Response, NextFunction } from 'express';
import { DeleteOrderDeliveryService } from '../../services/orderDelivery/DeleteOrderDeliveryService';

class DeleteOrderDeliveryController {
    async handle(req: Request, res: Response, next: NextFunction) {
        const store_id = req.admin?.store_id || undefined;
        const { id } = req.params;

        const deleteOrderDeliveryService = new DeleteOrderDeliveryService();

        const result = await deleteOrderDeliveryService.execute({ id, store_id });
        
        return res.json(result);
    }
}

export { DeleteOrderDeliveryController };
