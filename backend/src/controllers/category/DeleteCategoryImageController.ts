import { Request, Response, NextFunction } from 'express';
import { DeleteCategoryImageService } from '../../services/category/DeleteCategoryImageService';

class DeleteCategoryImageController {
    async handle(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;

        const deleteCategoryImageService = new DeleteCategoryImageService();

        const category = await deleteCategoryImageService.execute({ category_id: id });

        return res.json(category);
    }
}

export { DeleteCategoryImageController };
