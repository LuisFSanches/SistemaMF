import { Request, Response, NextFunction } from 'express';
import { GetDeliveryManByPhoneService } from '../../services/deliveryMan/GetDeliveryManByPhoneService';

class GetDeliveryManByPhoneController {
    async handle(req: Request, res: Response, next: NextFunction) {
        const store_id = req.admin?.store_id || undefined;
        const { phone_code } = req.query;

        const getDeliveryManByPhoneService = new GetDeliveryManByPhoneService();

        const deliveryMan = await getDeliveryManByPhoneService.execute({ 
            phone_code: phone_code as string,
            store_id
        });
        
        return res.json(deliveryMan);
    }
}

export { GetDeliveryManByPhoneController };
