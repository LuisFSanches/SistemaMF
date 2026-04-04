import { Request, Response, NextFunction } from 'express';
import { DeleteStoreProductImageService } from '../../services/storeProduct/DeleteStoreProductImageService';

class DeleteStoreProductImageController {
    async handle(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;
        const { image_field } = req.query;

        const deleteStoreProductImageService = new DeleteStoreProductImageService();

        const storeProduct = await deleteStoreProductImageService.execute({
            store_product_id: id,
            image_field: (image_field as 'image' | 'image_2' | 'image_3') || 'image'
        });

        return res.json(storeProduct);
    }
}

export { DeleteStoreProductImageController };
