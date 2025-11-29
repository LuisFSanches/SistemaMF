import { Request, Response, NextFunction } from 'express';
import { GetOrderDetailsService } from '../../services/order/GetOrderDetailsService';

class GetOrderDetailsController {
    async handle(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;

        const getOrderDetailsService = new GetOrderDetailsService();
        const orderDetails = await getOrderDetailsService.execute(id);

        return res.json(orderDetails);
    }
}

export { GetOrderDetailsController };
