import { Request, Response, NextFunction } from 'express';
import { GetStoreProductService } from '../../services/storeProduct/GetStoreProductService';

class GetStoreProductController {
    async handle(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;

        const getStoreProductService = new GetStoreProductService();

        const storeProduct = await getStoreProductService.execute({ id });

        return res.json(storeProduct);
    }
}

export { GetStoreProductController };
