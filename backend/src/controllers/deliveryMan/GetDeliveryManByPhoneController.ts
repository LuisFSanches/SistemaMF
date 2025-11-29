import { Request, Response, NextFunction } from 'express';
import { GetDeliveryManByPhoneService } from '../../services/deliveryMan/GetDeliveryManByPhoneService';

class GetDeliveryManByPhoneController {
    async handle(req: Request, res: Response, next: NextFunction) {
        const { phone_number } = req.query;

        const getDeliveryManByPhoneService = new GetDeliveryManByPhoneService();

        const deliveryMan = await getDeliveryManByPhoneService.execute({ 
            phone_number: phone_number as string 
        });
        
        return res.json(deliveryMan);
    }
}

export { GetDeliveryManByPhoneController };
