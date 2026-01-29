import {Request, Response, NextFunction} from 'express'
import { UpdateOrderStatusService } from '../../services/order/UpdateOrderStatusService'

class UpdateOrderStatusController{
    async handle(req: Request, res: Response, next: NextFunction) {
        const { id, status } = req.body;
        const store_id = req.admin?.store_id as string;

        const updateOrderStatusService = new UpdateOrderStatusService();

        const order = await updateOrderStatusService.execute({
            id,
            status,
            store_id
        });
        
        return res.json(order);
    }
}

export { UpdateOrderStatusController }