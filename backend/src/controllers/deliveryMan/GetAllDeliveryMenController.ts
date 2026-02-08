import { Request, Response, NextFunction } from 'express';
import { GetAllDeliveryMenService } from '../../services/deliveryMan/GetAllDeliveryMenService';

class GetAllDeliveryMenController {
    async handle(req: Request, res: Response, next: NextFunction) {
        const store_id = req.admin?.store_id || undefined;
        const { page = '1', pageSize = '10', query = '' } = req.query;
        const getAllDeliveryMenService = new GetAllDeliveryMenService();

        const deliveryMen = await getAllDeliveryMenService.execute(Number(page), Number(pageSize), String(query), store_id);
        
        return res.json(deliveryMen);
    }
}

export { GetAllDeliveryMenController };
