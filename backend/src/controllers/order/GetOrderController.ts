import {Request, Response} from 'express'
import { GetOrderService } from '../../services/order/GetOrderService'

class GetOrderController {
    async handle(req: Request, res: Response) {
        const { id } = req.params;

        const getOrder = new GetOrderService();

        const order = await getOrder.execute(id);

        return res.json(order)
    }
}   

export { GetOrderController }
