import { Request, Response, NextFunction } from 'express';
import { GetMercadoPagoPaymentStatusService } from '../../services/mercadoPago/GetMercadoPagoPaymentStatusService';

class GetMercadoPagoPaymentStatusController {
    async handle(req: Request, res: Response, next: NextFunction) {
        const { payment_id } = req.params;
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
