import { Request, Response, NextFunction } from 'express';
import { DeleteDeliveryRangeService } from '../../services/deliveryRange/DeleteDeliveryRangeService';

class DeleteDeliveryRangeController {
    async handle(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;

            const service = new DeleteDeliveryRangeService();
            const result = await service.execute(id);

            return res.json(result);
        } catch (error) {
            next(error);
        }
    }
}

export { DeleteDeliveryRangeController };
