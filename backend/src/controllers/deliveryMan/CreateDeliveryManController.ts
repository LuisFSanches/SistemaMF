import { Request, Response, NextFunction } from 'express';
import { CreateDeliveryManService } from '../../services/deliveryMan/CreateDeliveryManService';

class CreateDeliveryManController {
    async handle(req: Request, res: Response, next: NextFunction) {
        const { name, phone_number } = req.body;

        const createDeliveryManService = new CreateDeliveryManService();

        const deliveryMan = await createDeliveryManService.execute({
            name,
            phone_number
        });
        
        return res.json(deliveryMan);
    }
}

export { CreateDeliveryManController };
