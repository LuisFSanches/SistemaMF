import { Request, Response, NextFunction } from 'express';
import { GetAllCategoriesService } from '../../services/category/GetAllCategoriesService';

class GetAllCategoriesController {
    async handle(req: Request, res: Response, next: NextFunction) {
        const getAllCategoriesService = new GetAllCategoriesService();

        const categories = await getAllCategoriesService.execute();

        return res.json(categories);
    }
}

export { GetAllCategoriesController };
