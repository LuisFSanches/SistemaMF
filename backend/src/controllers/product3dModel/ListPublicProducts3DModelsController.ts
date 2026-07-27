import { Request, Response, NextFunction } from 'express';
import { ListPublicProducts3DModelsService } from '../../services/product3dModel/ListPublicProducts3DModelsService';

class ListPublicProducts3DModelsController {
    async handle(req: Request, res: Response, next: NextFunction) {
        const query = String(req.query.query || '').trim();

        const listPublicProducts3DModelsService = new ListPublicProducts3DModelsService();
        const products = await listPublicProducts3DModelsService.execute(query);

        return res.json(products);
    }
}

export { ListPublicProducts3DModelsController };
