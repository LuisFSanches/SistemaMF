import { Request, Response, NextFunction } from 'express';
import { GetOrderToReceiveService } from '../../services/orderToReceive/GetOrderToReceiveService';

class GetOrderToReceiveController {
    async handle(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;

        const getOrderToReceiveService = new GetOrderToReceiveService();

        const orderToReceive = await getOrderToReceiveService.execute({ id });
        
        return res.json(orderToReceive);
    }
}

export { GetOrderToReceiveController };
