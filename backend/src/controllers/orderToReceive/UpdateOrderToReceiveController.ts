import { Request, Response, NextFunction } from 'express';
import { UpdateOrderToReceiveService } from '../../services/orderToReceive/UpdateOrderToReceiveService';
import moment from 'moment-timezone';

class UpdateOrderToReceiveController {
    async handle(req: Request, res: Response, next: NextFunction) {
        const store_id = req.admin?.store_id || undefined;
        const { id } = req.params;
        const { payment_due_date, received_date, type, is_archived } = req.body;

        const updateOrderToReceiveService = new UpdateOrderToReceiveService();

        const data: any = {};
        
        if (payment_due_date) {
            data.payment_due_date = moment.utc(payment_due_date)
                .tz('America/Sao_Paulo', true)
                .set({ hour: 12, minute: 0, second: 0 })
                .toDate();
        }
        
        if (received_date) {
            data.received_date = moment.utc(received_date)
                .tz('America/Sao_Paulo', true)
                .set({ hour: 12, minute: 0, second: 0 })
                .toDate();
        }
        
        if (type) data.type = type;
        if (is_archived !== undefined) data.is_archived = is_archived;

        const orderToReceive = await updateOrderToReceiveService.execute({
            id,
            data,
            store_id
        });
        
        return res.json(orderToReceive);
    }
}

export { UpdateOrderToReceiveController };
