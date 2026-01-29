import { Request, Response, NextFunction } from 'express';
import { DeleteOrderToReceiveService } from '../../services/orderToReceive/DeleteOrderToReceiveService';

class DeleteOrderToReceiveController {
    async handle(req: Request, res: Response, next: NextFunction) {
        const store_id = req.admin?.store_id || undefined;
        const { id } = req.params;

        const deleteOrderToReceiveService = new DeleteOrderToReceiveService();

        const result = await deleteOrderToReceiveService.execute({ id, store_id });
        
        return res.json(result);
    }
}

export { DeleteOrderToReceiveController };
