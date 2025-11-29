import { Request, Response, NextFunction } from 'express';
import { GetAllOrderDeliveriesService } from '../../services/orderDelivery/GetAllOrderDeliveriesService';

class GetAllOrderDeliveriesController {
    async handle(req: Request, res: Response, next: NextFunction) {
        const { page = '1', pageSize = '10', query = '', filter } = req.query;
        const getAllOrderDeliveriesService = new GetAllOrderDeliveriesService();

        const orderDeliveries = await getAllOrderDeliveriesService.execute(
            Number(page), 
            Number(pageSize), 
            String(query),
            filter as string
        );
        
        return res.json(orderDeliveries);
    }
}

export { GetAllOrderDeliveriesController };
