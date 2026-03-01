import { Request, Response, NextFunction } from 'express';
import { CalculateDeliveryService } from '../../services/delivery/CalculateDeliveryService';

class CalculateDeliveryController {
    async handle(req: Request, res: Response, next: NextFunction) {
        try {
            const { storeId, customerLatitude, customerLongitude, city } = req.body;

            const service = new CalculateDeliveryService();
            const result = await service.execute({
                storeId,
                customerLatitude: Number(customerLatitude),
                customerLongitude: Number(customerLongitude),
                city,
            });

            return res.json(result);
        } catch (error) {
            next(error);
        }
    }
}

export { CalculateDeliveryController };
