import { Request, Response, NextFunction } from 'express';
import { RemoveProductCategoryService } from '../../services/productCategory/RemoveProductCategoryService';

class RemoveProductCategoryController {
    async handle(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;

        const removeProductCategoryService = new RemoveProductCategoryService();

        const result = await removeProductCategoryService.execute({ id });

        return res.json(result);
    }
}

export { RemoveProductCategoryController };
