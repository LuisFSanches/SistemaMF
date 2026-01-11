import { Request, Response, NextFunction } from 'express';
import { DeleteStoreProductService } from '../../services/storeProduct/DeleteStoreProductService';

class DeleteStoreProductController {
    async handle(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;

        const deleteStoreProductService = new DeleteStoreProductService();

        const result = await deleteStoreProductService.execute({ id });

        return res.json(result);
    }
}

export { DeleteStoreProductController };
