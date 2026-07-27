import { Request, Response, NextFunction } from 'express';
import { ListProducts3DModelsService } from '../../services/product3dModel/ListProducts3DModelsService';

class ListProducts3DModelsController {
    async handle(req: Request, res: Response, next: NextFunction) {
        const query = String(req.query.query || '').trim();

        const listProducts3DModelsService = new ListProducts3DModelsService();
        const products = await listProducts3DModelsService.execute(query);

        return res.json(products);
    }
}

export { ListProducts3DModelsController };
