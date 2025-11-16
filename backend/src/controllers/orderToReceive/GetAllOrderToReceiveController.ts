import { Request, Response, NextFunction } from 'express';
import { GetAllOrderToReceiveService } from '../../services/orderToReceive/GetAllOrderToReceiveService';

class GetAllOrderToReceiveController {
    async handle(req: Request, res: Response, next: NextFunction) {
        const page = parseInt(req.query.page as string) || 1;
        const pageSize = parseInt(req.query.pageSize as string) || 10;
        const query = req.query.query as string;

        const getAllOrderToReceiveService = new GetAllOrderToReceiveService();

        const result = await getAllOrderToReceiveService.execute(page, pageSize, query);
        
        return res.json(result);
    }
}

export { GetAllOrderToReceiveController };
