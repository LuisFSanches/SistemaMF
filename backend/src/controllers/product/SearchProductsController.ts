import { Request, Response, NextFunction } from 'express';
import { SearchProductsService } from '../../services/product/SearchProductsService';

export class SearchProductsController {
    async handle(req: Request, res: Response, next: NextFunction) {
        const query = String(req.query.q || '').trim();
        const store_id = req.admin?.store_id || null;
        
        const service = new SearchProductsService();
        const products = await service.execute(query, store_id);

        return res.json(products);
    }
}
