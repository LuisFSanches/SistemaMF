import { Request, Response, NextFunction } from 'express';
import { CreateMercadoPagoPreferenceService } from '../../services/mercadoPago/CreateMercadoPagoPreferenceService';

class CreateMercadoPagoPreferenceController {
    async handle(req: Request, res: Response, next: NextFunction) {
        const { order_id, store_slug, items, payer, back_urls, shipments } = req.body;

        const createMercadoPagoPreferenceService = new CreateMercadoPagoPreferenceService();

        try {
            const preference = await createMercadoPagoPreferenceService.execute({
                order_id,
                store_slug,
                items,
                payer,
                back_urls,
                shipments,
            });

            return res.json(preference);
        } catch (error) {
            next(error);
        }
    }
}

export { CreateMercadoPagoPreferenceController };
