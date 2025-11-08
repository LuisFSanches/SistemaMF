import { Request, Response, NextFunction } from 'express';
import { DeleteProductImageService } from '../../services/product/DeleteProductImageService';

class DeleteProductImageController {
    async handle(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;

        const deleteProductImageService = new DeleteProductImageService();

        const product = await deleteProductImageService.execute({
            product_id: id
        });

        return res.json(product);
    }
}

export { DeleteProductImageController };
