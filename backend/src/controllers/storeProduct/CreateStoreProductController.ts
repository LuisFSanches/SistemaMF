import { Request, Response, NextFunction } from 'express';
import { CreateStoreProductService } from '../../services/storeProduct/CreateStoreProductService';

class CreateStoreProductController {
    async handle(req: Request, res: Response, next: NextFunction) {
        const { store_id, product_id, price, stock, enabled, visible_for_online_store } = req.body;

        const createStoreProductService = new CreateStoreProductService();

        const storeProduct = await createStoreProductService.execute({
            store_id,
            product_id,
            price,
            stock,
            enabled,
            visible_for_online_store,
        });

        return res.json(storeProduct);
    }
}

export { CreateStoreProductController };
