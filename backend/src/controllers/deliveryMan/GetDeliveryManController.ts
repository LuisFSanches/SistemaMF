import { Request, Response, NextFunction } from 'express';
import { GetDeliveryManService } from '../../services/deliveryMan/GetDeliveryManService';

class GetDeliveryManController {
    async handle(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;
        const { page = '1', pageSize = '10', startDate, endDate } = req.query;

        const getDeliveryManService = new GetDeliveryManService();

        const deliveryMan = await getDeliveryManService.execute({ 
            id,
            page: Number(page),
            pageSize: Number(pageSize),
            startDate: startDate as string,
            endDate: endDate as string
        });
        
        return res.json(deliveryMan);
    }
}

export { GetDeliveryManController };
