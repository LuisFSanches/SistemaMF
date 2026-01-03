import { Request, Response, NextFunction } from 'express';
import { GetAllOrderToReceiveService } from '../../services/orderToReceive/GetAllOrderToReceiveService';

class GetAllOrderToReceiveController {
    async handle(req: Request, res: Response, next: NextFunction) {
        const store_id = req.admin?.store_id || undefined;
        const page = parseInt(req.query.page as string) || 1;
        const pageSize = parseInt(req.query.pageSize as string) || 10;
        const query = req.query.query as string;
        const filter = req.query.filter as string;

        const getAllOrderToReceiveService = new GetAllOrderToReceiveService();

        const result = await getAllOrderToReceiveService.execute(page, pageSize, query, filter, store_id);
        
        return res.json(result);
    }
}

export { GetAllOrderToReceiveController };
