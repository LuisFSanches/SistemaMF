import {Request, Response} from 'express'
import { GetCompleteOrderService } from '../../services/order/GetCompleteOrderService'

class GetCompleteOrderController {
    async handle(req: Request, res: Response) {
        const { id } = req.params;
        const store_id = req.admin?.store_id || undefined;

        const getOrder = new GetCompleteOrderService();
        const order = await getOrder.execute(id, store_id);

        return res.json(order)
    }
}   

export { GetCompleteOrderController }
