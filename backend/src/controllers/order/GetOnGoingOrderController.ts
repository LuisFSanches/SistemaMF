import {Request, Response} from 'express'
import { GetOnGoingOrderService } from '../../services/order/GetOnGoingOrderService'

class GetOnGoingOrderController {
    async handle(req: Request, res: Response) {
        const getOnGoingOrders = new GetOnGoingOrderService();

        const orders = await getOnGoingOrders.execute();

        return res.json(orders)
    }
}

export { GetOnGoingOrderController }
