import { Request, Response, NextFunction } from 'express';
import { CreateCategoryService } from '../../services/category/CreateCategoryService';

class CreateCategoryController {
    async handle(req: Request, res: Response, next: NextFunction) {
        const { name, slug } = req.body;

        const createCategoryService = new CreateCategoryService();

        const category = await createCategoryService.execute({
            name,
            slug
        });

        return res.json(category);
    }
}

export { CreateCategoryController };
