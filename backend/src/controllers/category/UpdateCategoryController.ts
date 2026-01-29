import { Request, Response, NextFunction } from 'express';
import { UpdateCategoryService } from '../../services/category/UpdateCategoryService';

class UpdateCategoryController {
    async handle(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;
        const { name, slug } = req.body;

        const updateCategoryService = new UpdateCategoryService();

        const category = await updateCategoryService.execute({
            id,
            name,
            slug
        });

        return res.json(category);
    }
}

export { UpdateCategoryController };
