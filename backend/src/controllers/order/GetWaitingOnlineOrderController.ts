import {Request, Response} from 'express'
import { GetWaitingOnlineOrderService } from '../../services/order/GetWaitingOnlineOrderService';

class GetWaitingOnlineOrderController {
    async handle(req: Request, res: Response) {
        const getWaitingOnlineOrderService = new GetWaitingOnlineOrderService();
        const orders = await getWaitingOnlineOrderService.execute();

        return res.json(orders);
    }
}

export { GetWaitingOnlineOrderController }
