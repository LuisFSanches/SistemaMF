import {Request, Response, NextFunction} from 'express';
import { DeleteOrderService } from '../../services/order/DeleteOrderService';

class DeleteOrderController{
	async handle(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;
        const store_id = req.admin?.store_id || undefined;
        const deleteOrderService = new DeleteOrderService();

        const data = await deleteOrderService.execute(id, store_id);

		return res.json(data)
	}
}

export { DeleteOrderController }
