import { Request, Response, NextFunction } from 'express';
import { TestMercadoPagoWebhookService } from '../../services/mercadoPago/TestMercadoPagoWebhookService';

class TestMercadoPagoWebhookController {
    async handle(req: Request, res: Response, next: NextFunction) {
        const { order_id, payment_status, payment_type, payment_amount } = req.body;

        console.log('[TestMercadoPagoWebhookController] Test webhook received:', {
            order_id,
            payment_status,
            payment_type,
            payment_amount,
            timestamp: new Date().toISOString(),
        });

        const testMercadoPagoWebhookService = new TestMercadoPagoWebhookService();

        const result = await testMercadoPagoWebhookService.execute({
            order_id,
            payment_status,
            payment_type,
            payment_amount
        });

        console.log('[TestMercadoPagoWebhookController] Test webhook processed:', result);

        return res.json(result);
    }
}

export { TestMercadoPagoWebhookController };
