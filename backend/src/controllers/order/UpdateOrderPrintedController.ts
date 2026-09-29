import { Request, Response, NextFunction } from 'express';
import { UpdateOrderPrintedService } from '../../services/order/UpdateOrderPrintedService';

class UpdateOrderPrintedController {
    async handle(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;
        const store_id = req.admin?.store_id as string;

        const updateOrderPrintedService = new UpdateOrderPrintedService();

        const order = await updateOrderPrintedService.execute({
            id,
            store_id
        });

        return res.json(order);
    }
}

export { UpdateOrderPrintedController };
