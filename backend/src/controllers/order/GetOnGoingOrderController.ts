import {Request, Response} from 'express'
import { GetOnGoingOrderService } from '../../services/order/GetOnGoingOrderService'

class GetOnGoingOrderController {
    async handle(req: Request, res: Response) {
        const store_id = req.admin?.store_id || undefined;
        const getOnGoingOrders = new GetOnGoingOrderService();

        const orders = await getOnGoingOrders.execute(store_id);

        return res.json(orders)
    }
}

export { GetOnGoingOrderController }
