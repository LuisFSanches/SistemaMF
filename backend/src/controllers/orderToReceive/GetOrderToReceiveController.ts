import { Request, Response, NextFunction } from 'express';
import { GetOrderToReceiveService } from '../../services/orderToReceive/GetOrderToReceiveService';

class GetOrderToReceiveController {
    async handle(req: Request, res: Response, next: NextFunction) {
        const store_id = req.admin?.store_id || undefined;
        const { id } = req.params;

        const getOrderToReceiveService = new GetOrderToReceiveService();

        const orderToReceive = await getOrderToReceiveService.execute({ id, store_id });
        
        return res.json(orderToReceive);
    }
}

export { GetOrderToReceiveController };
