import {Request, Response} from 'express'
import { GetAllOrderService } from '../../services/order/GetAllOrderService';

class GetAllOrderController {
    async handle(req: Request, res: Response) {
        const { page = '1', pageSize = '10', query, clientName, orderCode, phoneNumber, productName, startDate, endDate } = req.query;
        const store_id = req.admin?.store_id || undefined;

        const getAllOrderService = new GetAllOrderService();
        const orders = await getAllOrderService.execute(
            Number(page),
            Number(pageSize),
            { query, clientName, orderCode, phoneNumber, productName },
            startDate as string,
            endDate as string,
            store_id
        );

        return res.json(orders);
    }
}

export { GetAllOrderController }
