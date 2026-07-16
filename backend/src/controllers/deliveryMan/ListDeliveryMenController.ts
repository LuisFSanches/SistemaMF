import { Request, Response, NextFunction } from 'express';
import { ListDeliveryMenService } from '../../services/deliveryMan/ListDeliveryMenService';

class ListDeliveryMenController {
    async handle(req: Request, res: Response, next: NextFunction) {
        const store_id = req.admin?.store_id || undefined;
        const listDeliveryMenService = new ListDeliveryMenService();

        const deliveryMen = await listDeliveryMenService.execute(store_id);

        return res.json(deliveryMen);
    }
}

export { ListDeliveryMenController };
