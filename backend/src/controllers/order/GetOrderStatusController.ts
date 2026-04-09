import { Request, Response, NextFunction } from 'express';
import { GetOrderStatusService } from '../../services/order/GetOrderStatusService';

class GetOrderStatusController {
    async handle(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;

        const getOrderStatusService = new GetOrderStatusService();

        const result = await getOrderStatusService.execute({
            order_id: id
        });
        
        return res.json(result);
    }
}

export { GetOrderStatusController };
