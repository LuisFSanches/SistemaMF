import {Request, Response} from 'express'
import { GetWaitingOnlineOrderService } from '../../services/order/GetWaitingOnlineOrderService';

class GetWaitingOnlineOrderController {
    async handle(req: Request, res: Response) {
        const store_id = req.admin?.store_id || undefined;
        const getWaitingOnlineOrderService = new GetWaitingOnlineOrderService();
        const orders = await getWaitingOnlineOrderService.execute(store_id);

        return res.json(orders);
    }
}

export { GetWaitingOnlineOrderController }
