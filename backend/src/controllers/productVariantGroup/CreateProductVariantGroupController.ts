import { Request, Response, NextFunction } from 'express';
import { CreateProductVariantGroupService } from '../../services/productVariantGroup/CreateProductVariantGroupService';

class CreateProductVariantGroupController {
    async handle(req: Request, res: Response, next: NextFunction) {
        const { name, description, variants } = req.body;

        const createProductVariantGroupService = new CreateProductVariantGroupService();

        const group = await createProductVariantGroupService.execute({
            name,
            description,
            variants
        });

        return res.json(group);
    }
}

export { CreateProductVariantGroupController };
