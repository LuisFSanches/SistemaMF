import { Request, Response, NextFunction } from 'express';
import { CreateOrderToReceiveService } from '../../services/orderToReceive/CreateOrderToReceiveService';
import moment from 'moment-timezone';

class CreateOrderToReceiveController {
    async handle(req: Request, res: Response, next: NextFunction) {
        const { order_id, payment_due_date, received_date, type, is_archived } = req.body;

        const createOrderToReceiveService = new CreateOrderToReceiveService();

        const formattedPaymentDueDate = moment.utc(payment_due_date)
            .tz('America/Sao_Paulo', true)
            .set({ hour: 16, minute: 0, second: 0 })
            .toDate();

        const formattedReceivedDate = received_date 
            ? moment.utc(received_date)
                .tz('America/Sao_Paulo', true)
                .set({ hour: 12, minute: 0, second: 0 })
                .toDate()
            : undefined;

        const orderToReceive = await createOrderToReceiveService.execute({
            order_id,
            payment_due_date: formattedPaymentDueDate,
            received_date: formattedReceivedDate,
            type,
            is_archived
        });
        
        return res.json(orderToReceive);
    }
}

export { CreateOrderToReceiveController };
