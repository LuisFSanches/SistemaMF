import {Request, Response} from 'express'
import { GetPanelOrdersService } from '../../services/order/GetPanelOrdersService'

class GetPanelOrdersController {
    async handle(req: Request, res: Response) {
        const store_id = req.admin?.store_id || undefined;

        const getPanelOrders = new GetPanelOrdersService();

        const result = await getPanelOrders.execute(store_id);

        return res.json(result)
    }
}

export { GetPanelOrdersController }
