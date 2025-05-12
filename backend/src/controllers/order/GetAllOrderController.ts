import {Request, Response} from 'express'
import { GetAllOrderService } from '../../services/order/GetAllOrderService';

class GetAllOrderController {
    async handle(req: Request, res: Response) {
        const { page = '1', pageSize = '10', query = '' } = req.query;

        const getAllOrderService = new GetAllOrderService();
        const orders = await getAllOrderService.execute(
            Number(page),
            Number(pageSize),
            String(query)
        );

        return res.json(orders);
    }
}

export { GetAllOrderController }
