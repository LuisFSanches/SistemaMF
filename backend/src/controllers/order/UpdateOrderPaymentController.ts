import { Request, Response, NextFunction } from 'express';
import { UpdateOrderPaymentService } from '../../services/order/UpdateOrderPaymentService';

class UpdateOrderPaymentController {
    async handle(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;
        const { payment_received } = req.body;
        const store_id = req.admin?.store_id as string;

        const updateOrderPaymentService = new UpdateOrderPaymentService();

        const order = await updateOrderPaymentService.execute({
            id,
            payment_received,
            store_id
        });
        
        return res.json(order);
    }
}

export { UpdateOrderPaymentController };
