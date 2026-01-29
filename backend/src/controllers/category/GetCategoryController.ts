import { Request, Response, NextFunction } from 'express';
import { GetCategoryService } from '../../services/category/GetCategoryService';

class GetCategoryController {
    async handle(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;

        const getCategoryService = new GetCategoryService();

        const category = await getCategoryService.execute({ id });

        return res.json(category);
    }
}

export { GetCategoryController };
