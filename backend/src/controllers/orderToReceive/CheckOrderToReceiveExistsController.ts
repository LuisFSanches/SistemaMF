import { Request, Response, NextFunction } from 'express';
import { CheckOrderToReceiveExistsService } from '../../services/orderToReceive/CheckOrderToReceiveExistsService';

class CheckOrderToReceiveExistsController {
    async handle(req: Request, res: Response, next: NextFunction) {
        const store_id = req.admin?.store_id || undefined;
        const { orderId } = req.params;

        const checkOrderToReceiveExistsService = new CheckOrderToReceiveExistsService();

        const result = await checkOrderToReceiveExistsService.execute({ order_id: orderId, store_id });
        
        return res.json(result);
    }
}

export { CheckOrderToReceiveExistsController };
