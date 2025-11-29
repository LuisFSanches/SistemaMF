import { Request, Response, NextFunction } from 'express';
import { GetDeliveryManService } from '../../services/deliveryMan/GetDeliveryManService';

class GetDeliveryManController {
    async handle(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;

        const getDeliveryManService = new GetDeliveryManService();

        const deliveryMan = await getDeliveryManService.execute({ id });
        
        return res.json(deliveryMan);
    }
}

export { GetDeliveryManController };
