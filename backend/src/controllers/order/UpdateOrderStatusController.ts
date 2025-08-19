import {Request, Response, NextFunction} from 'express'
import { UpdateOrderStatusService } from '../../services/order/UpdateOrderStatusService'

class UpdateOrderStatusController{
    async handle(req: Request, res: Response, next: NextFunction) {
        const { id, status } = req.body;

        const updateOrderStatusService = new UpdateOrderStatusService();

        const order = await updateOrderStatusService.execute({
            id,
            status,
        });
        
        return res.json(order);
    }
}

export { UpdateOrderStatusController }