import { Request, Response, NextFunction } from 'express';
import { GetAllOrderDeliveriesService } from '../../services/orderDelivery/GetAllOrderDeliveriesService';

class GetAllOrderDeliveriesController {
    async handle(req: Request, res: Response, next: NextFunction) {
        const store_id = req.admin?.store_id || undefined;
        const { page = '1', pageSize = '10', query = '', filter, startDate, endDate, delivery_man_id } = req.query;
        const getAllOrderDeliveriesService = new GetAllOrderDeliveriesService();

        const orderDeliveries = await getAllOrderDeliveriesService.execute(
            Number(page),
            Number(pageSize),
            String(query),
            filter as string,
            startDate as string,
            endDate as string,
            store_id,
            delivery_man_id as string
        );
        
        return res.json(orderDeliveries);
    }
}

export { GetAllOrderDeliveriesController };
