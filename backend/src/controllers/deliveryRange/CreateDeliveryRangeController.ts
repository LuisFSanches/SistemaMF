import { Request, Response, NextFunction } from 'express';
import { CreateDeliveryRangeService } from '../../services/deliveryRange/CreateDeliveryRangeService';

class CreateDeliveryRangeController {
    async handle(req: Request, res: Response, next: NextFunction) {
        try {
            const { store_id, min_km, max_km, price } = req.body;

            const service = new CreateDeliveryRangeService();
            const result = await service.execute({
                store_id,
                min_km: Number(min_km),
                max_km: Number(max_km),
                price: Number(price),
            });

            return res.status(201).json(result);
        } catch (error) {
            next(error);
        }
    }
}

export { CreateDeliveryRangeController };
