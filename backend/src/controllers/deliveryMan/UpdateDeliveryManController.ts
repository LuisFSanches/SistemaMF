import { Request, Response, NextFunction } from 'express';
import { UpdateDeliveryManService } from '../../services/deliveryMan/UpdateDeliveryManService';

class UpdateDeliveryManController {
    async handle(req: Request, res: Response, next: NextFunction) {
        const store_id = req.admin?.store_id || undefined;
        const { id } = req.params;
        const { name, phone_number } = req.body;

        const updateDeliveryManService = new UpdateDeliveryManService();

        const deliveryMan = await updateDeliveryManService.execute({
            id,
            name,
            phone_number
        }, store_id);
        
        return res.json(deliveryMan);
    }
}

export { UpdateDeliveryManController };
