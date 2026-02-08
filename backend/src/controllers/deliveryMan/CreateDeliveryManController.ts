import { Request, Response, NextFunction } from 'express';
import { CreateDeliveryManService } from '../../services/deliveryMan/CreateDeliveryManService';

class CreateDeliveryManController {
    async handle(req: Request, res: Response, next: NextFunction) {
        const store_id = req.admin?.store_id || undefined;
        const { name, phone_number } = req.body;

        const createDeliveryManService = new CreateDeliveryManService();

        const deliveryMan = await createDeliveryManService.execute({
            name,
            phone_number
        }, store_id);
        
        return res.json(deliveryMan);
    }
}

export { CreateDeliveryManController };
