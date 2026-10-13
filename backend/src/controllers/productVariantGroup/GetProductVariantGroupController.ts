import { Request, Response, NextFunction } from 'express';
import { GetProductVariantGroupService } from '../../services/productVariantGroup/GetProductVariantGroupService';

class GetProductVariantGroupController {
    async handle(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;

        const getProductVariantGroupService = new GetProductVariantGroupService();

        const group = await getProductVariantGroupService.execute({ id });

        return res.json(group);
    }
}

export { GetProductVariantGroupController };
