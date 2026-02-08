import { Request, Response, NextFunction } from 'express';
import { RemoveAllProductCategoriesService } from '../../services/productCategory/RemoveAllProductCategoriesService';

class RemoveAllProductCategoriesController {
    async handle(req: Request, res: Response, next: NextFunction) {
        const { product_id } = req.params;

        const removeAllProductCategoriesService = new RemoveAllProductCategoriesService();

        const result = await removeAllProductCategoriesService.execute({ product_id });

        return res.json(result);
    }
}

export { RemoveAllProductCategoriesController };
