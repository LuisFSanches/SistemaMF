import { Request, Response, NextFunction } from 'express';
import { DeleteCategoryService } from '../../services/category/DeleteCategoryService';

class DeleteCategoryController {
    async handle(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;

        const deleteCategoryService = new DeleteCategoryService();

        const result = await deleteCategoryService.execute({ id });

        return res.json(result);
    }
}

export { DeleteCategoryController };
