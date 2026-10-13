import { Request, Response, NextFunction } from 'express';
import { UpdateProductVariantGroupService } from '../../services/productVariantGroup/UpdateProductVariantGroupService';

class UpdateProductVariantGroupController {
    async handle(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;
        const { name, description } = req.body;

        const updateProductVariantGroupService = new UpdateProductVariantGroupService();

        const group = await updateProductVariantGroupService.execute({
            id,
            name,
            description
        });

        return res.json(group);
    }
}

export { UpdateProductVariantGroupController };
