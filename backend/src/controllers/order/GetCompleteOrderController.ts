import {Request, Response} from 'express'
import { GetCompleteOrderService } from '../../services/order/GetCompleteOrderService'

class GetCompleteOrderController {
    async handle(req: Request, res: Response) {
        const { id } = req.params;

        const getOrder = new GetCompleteOrderService();
        const order = await getOrder.execute(id);

        return res.json(order)
    }
}   

export { GetCompleteOrderController }
