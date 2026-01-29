import { Request, Response, NextFunction } from 'express';
import { DeleteProductImageService } from '../../services/product/DeleteProductImageService';

class DeleteProductImageController {
    async handle(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;
        const { image_field } = req.query;

        const deleteProductImageService = new DeleteProductImageService();

        const product = await deleteProductImageService.execute({
            product_id: id,
            image_field: (image_field as 'image' | 'image_2' | 'image_3') || 'image'
        });

        return res.json(product);
    }
}

export { DeleteProductImageController };
