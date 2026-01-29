import { Request, Response, NextFunction } from 'express';
import { UpdateProductCategoriesService } from '../../services/productCategory/UpdateProductCategoriesService';

class UpdateProductCategoriesController {
    async handle(req: Request, res: Response, next: NextFunction) {
        const { product_id } = req.params;
        const { category_ids } = req.body;

        const updateProductCategoriesService = new UpdateProductCategoriesService();

        const categories = await updateProductCategoriesService.execute({
            product_id,
            category_ids
        });

        return res.json(categories);
    }
}

export { UpdateProductCategoriesController };
