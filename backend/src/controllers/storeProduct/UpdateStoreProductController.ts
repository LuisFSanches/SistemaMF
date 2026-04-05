import { Request, Response, NextFunction } from 'express';
import { UpdateStoreProductService } from '../../services/storeProduct/UpdateStoreProductService';

class UpdateStoreProductController {
    async handle(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;
        const { price, stock, enabled, visible_for_online_store, description } = req.body;

        const updateStoreProductService = new UpdateStoreProductService();

        const storeProduct = await updateStoreProductService.execute({
            id,
            price,
            stock,
            enabled,
            visible_for_online_store,
            description,
        });

        return res.json(storeProduct);
    }
}

export { UpdateStoreProductController };
