import { Request, Response, NextFunction } from 'express';
import { GetAllProductVariantGroupsService } from '../../services/productVariantGroup/GetAllProductVariantGroupsService';

class GetAllProductVariantGroupsController {
    async handle(req: Request, res: Response, next: NextFunction) {
        const { page, pageSize, query } = req.query;

        const getAllProductVariantGroupsService = new GetAllProductVariantGroupsService();

        const result = await getAllProductVariantGroupsService.execute({
            page: page ? parseInt(page as string, 10) : 1,
            pageSize: pageSize ? parseInt(pageSize as string, 10) : 20,
            query: typeof query === 'string' ? query : undefined
        });

        return res.json(result);
    }
}

export { GetAllProductVariantGroupsController };
