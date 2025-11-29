import { Request, Response, NextFunction } from 'express';
import { DeleteOrderDeliveryService } from '../../services/orderDelivery/DeleteOrderDeliveryService';

class DeleteOrderDeliveryController {
    async handle(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;

        const deleteOrderDeliveryService = new DeleteOrderDeliveryService();

        const result = await deleteOrderDeliveryService.execute({ id });
        
        return res.json(result);
    }
}

export { DeleteOrderDeliveryController };
