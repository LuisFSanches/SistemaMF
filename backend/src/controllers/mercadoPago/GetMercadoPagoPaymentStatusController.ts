import { Request, Response, NextFunction } from 'express';
import { GetMercadoPagoPaymentStatusService } from '../../services/mercadoPago/GetMercadoPagoPaymentStatusService';

class GetMercadoPagoPaymentStatusController {
    async handle(req: Request, res: Response, next: NextFunction) {
        // Aceita payment_id via params (rota legacy) ou query params
        const payment_id = (req.params.payment_id || req.query.payment_id) as string;
        const { store_slug } = req.query;

        const getMercadoPagoPaymentStatusService = new GetMercadoPagoPaymentStatusService();

        try {
            const paymentStatus = await getMercadoPagoPaymentStatusService.execute({
                payment_id,
                store_slug: store_slug as string | undefined,
            });

            return res.json(paymentStatus);
        } catch (error) {
            next(error);
        }
    }
}

export { GetMercadoPagoPaymentStatusController };
