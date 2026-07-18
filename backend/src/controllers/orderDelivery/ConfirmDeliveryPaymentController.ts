import { Request, Response, NextFunction } from 'express';
import { ConfirmDeliveryPaymentService } from '../../services/orderDelivery/ConfirmDeliveryPaymentService';

class ConfirmDeliveryPaymentController {
    async handle(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;

        const confirmDeliveryPaymentService = new ConfirmDeliveryPaymentService();
        const order = await confirmDeliveryPaymentService.execute(id);

        return res.json(order);
    }
}

export { ConfirmDeliveryPaymentController };
