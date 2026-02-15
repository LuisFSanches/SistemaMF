import { Request, Response, NextFunction } from 'express';
import { SendWhatsAppMessageService } from '../../services/whatsapp/SendWhatsAppMessageService';

class SendWhatsAppMessageController {
    async handle(req: Request, res: Response, next: NextFunction) {
        const { phone_number, customer_name, order_number, store_name } = req.body;

        const sendWhatsAppMessageService = new SendWhatsAppMessageService();

        const result = await sendWhatsAppMessageService.execute({
            phone_number,
            customer_name,
            order_number,
            store_name
        });
        
        return res.json(result);
    }
}

export { SendWhatsAppMessageController };
