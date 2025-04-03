import {Request, Response, NextFunction} from 'express';
import { DeleteOrderService } from '../../services/order/DeleteOrderService';

class DeleteOrderController{
	async handle(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;
        const deleteOrderService = new DeleteOrderService();

        const data = await deleteOrderService.execute(id);

		return res.json(data)
	}
}

export { DeleteOrderController }
