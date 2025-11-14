import { Request, Response, NextFunction } from 'express';
import { DeleteOrderToReceiveService } from '../../services/orderToReceive/DeleteOrderToReceiveService';

class DeleteOrderToReceiveController {
    async handle(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;

        const deleteOrderToReceiveService = new DeleteOrderToReceiveService();

        const result = await deleteOrderToReceiveService.execute({ id });
        
        return res.json(result);
    }
}

export { DeleteOrderToReceiveController };
