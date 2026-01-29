import { Request, Response, NextFunction } from 'express';
import { GetCategoryBySlugService } from '../../services/category/GetCategoryBySlugService';

class GetCategoryBySlugController {
    async handle(req: Request, res: Response, next: NextFunction) {
        const { slug } = req.params;

        const getCategoryBySlugService = new GetCategoryBySlugService();

        const category = await getCategoryBySlugService.execute({ slug });

        return res.json(category);
    }
}

export { GetCategoryBySlugController };
