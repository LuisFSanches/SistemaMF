import { Request, Response, NextFunction } from 'express';
import { GetStoreProductByIdService } from '../../services/storeProduct/GetStoreProductByIdService';

class GetStoreProductByIdController {
    async handle(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;

        const getStoreProductByIdService = new GetStoreProductByIdService();

        const storeProduct = await getStoreProductByIdService.execute({ id });

        return res.json(storeProduct);
    }
}

export { GetStoreProductByIdController };
