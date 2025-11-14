import { Request, Response, NextFunction } from 'express';
import { GetAllOrderToReceiveService } from '../../services/orderToReceive/GetAllOrderToReceiveService';

class GetAllOrderToReceiveController {
    async handle(req: Request, res: Response, next: NextFunction) {
        const getAllOrderToReceiveService = new GetAllOrderToReceiveService();

        const ordersToReceive = await getAllOrderToReceiveService.execute();
        
        return res.json(ordersToReceive);
    }
}

export { GetAllOrderToReceiveController };
