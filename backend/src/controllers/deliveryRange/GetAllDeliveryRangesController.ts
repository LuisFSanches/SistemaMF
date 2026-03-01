import { Request, Response, NextFunction } from 'express';
import { GetAllDeliveryRangesService } from '../../services/deliveryRange/GetAllDeliveryRangesService';

class GetAllDeliveryRangesController {
    async handle(req: Request, res: Response, next: NextFunction) {
        try {
            const { store_id } = req.params;

            const service = new GetAllDeliveryRangesService();
            const result = await service.execute(store_id);

            return res.json(result);
        } catch (error) {
            next(error);
        }
    }
}

export { GetAllDeliveryRangesController };
