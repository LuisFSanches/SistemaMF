import { Request, Response, NextFunction } from 'express';
import { AddProductCategoryService } from '../../services/productCategory/AddProductCategoryService';

class AddProductCategoryController {
    async handle(req: Request, res: Response, next: NextFunction) {
        const { product_id, category_id } = req.body;

        const addProductCategoryService = new AddProductCategoryService();

        const productCategory = await addProductCategoryService.execute({
            product_id,
            category_id
        });

        return res.json(productCategory);
    }
}

export { AddProductCategoryController };
