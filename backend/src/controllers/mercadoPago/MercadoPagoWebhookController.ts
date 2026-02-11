import { Request, Response, NextFunction } from 'express';
import { ProcessMercadoPagoWebhookService } from '../../services/mercadoPago/ProcessMercadoPagoWebhookService';

class MercadoPagoWebhookController {
    async handle(req: Request, res: Response, next: NextFunction) {
        const notificationData = req.body;
        const { store_slug } = req.query;

        console.log('[MercadoPagoWebhookController] Webhook received:', {
            store_slug,
            type: notificationData.type,
            action: notificationData.action,
            data_id: notificationData.data?.id,
            timestamp: new Date().toISOString(),
        });

        const processMercadoPagoWebhookService = new ProcessMercadoPagoWebhookService();

        try {
            // O Mercado Pago espera resposta 200 imediatamente
            // Processamos a notificação de forma assíncrona para evitar timeouts
            
            const result = await processMercadoPagoWebhookService.execute(
                notificationData,
                store_slug as string | undefined
            );

            console.log('[MercadoPagoWebhookController] Webhook processed successfully:', result);

            // Retornar 200 OK para o Mercado Pago
            return res.status(200).json(result);
        } catch (error) {
            console.error("[MercadoPagoWebhookController] Error:", error);
            // Mesmo em caso de erro, retornamos 200 para não receber a mesma notificação novamente
            // O erro já foi logado para análise posterior
            return res.status(200).json({ success: false, message: 'Error processing notification' });
        }
    }
}

export { MercadoPagoWebhookController };
