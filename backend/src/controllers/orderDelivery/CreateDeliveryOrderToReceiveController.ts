import { Request, Response, NextFunction } from 'express';
import { CreateDeliveryOrderToReceiveService } from '../../services/orderDelivery/CreateDeliveryOrderToReceiveService';

class CreateDeliveryOrderToReceiveController {
    async handle(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;

        const createDeliveryOrderToReceiveService = new CreateDeliveryOrderToReceiveService();
        const orderToReceive = await createDeliveryOrderToReceiveService.execute(id);

        return res.json(orderToReceive);
    }
}

export { CreateDeliveryOrderToReceiveController };
