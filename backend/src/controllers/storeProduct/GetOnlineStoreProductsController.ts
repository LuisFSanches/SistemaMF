import { Request, Response, NextFunction } from 'express';
import { GetOnlineStoreProductsService } from '../../services/storeProduct/GetOnlineStoreProductsService';

class GetOnlineStoreProductsController {
    async handle(req: Request, res: Response, next: NextFunction) {
        const { store_id, page, pageSize, query } = req.query;

        if (!store_id || typeof store_id !== 'string') {
            return res.status(400).json({ error: "store_id is required" });
        }

        const pageNumber = page ? parseInt(page as string, 10) : 1;
        const pageSizeNumber = pageSize ? parseInt(pageSize as string, 10) : 8;
        const searchQuery = query && typeof query === 'string' ? query : undefined;

        const getOnlineStoreProductsService = new GetOnlineStoreProductsService();

        const result = await getOnlineStoreProductsService.execute({ 
            store_id,
            page: pageNumber,
            pageSize: pageSizeNumber,
            query: searchQuery  
        });

        return res.json(result);
    }
}

export { GetOnlineStoreProductsController };
