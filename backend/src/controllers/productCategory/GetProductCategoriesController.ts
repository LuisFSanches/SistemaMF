import { Request, Response, NextFunction } from 'express';
import { GetProductCategoriesService } from '../../services/productCategory/GetProductCategoriesService';

class GetProductCategoriesController {
    async handle(req: Request, res: Response, next: NextFunction) {
        const { product_id } = req.params;

        const getProductCategoriesService = new GetProductCategoriesService();

        const categories = await getProductCategoriesService.execute({ product_id });

        return res.json(categories);
    }
}

export { GetProductCategoriesController };
