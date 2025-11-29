import { Request, Response, NextFunction } from 'express';
import { DeleteDeliveryManService } from '../../services/deliveryMan/DeleteDeliveryManService';

class DeleteDeliveryManController {
    async handle(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;

        const deleteDeliveryManService = new DeleteDeliveryManService();

        const result = await deleteDeliveryManService.execute({ id });
        
        return res.json(result);
    }
}

export { DeleteDeliveryManController };
