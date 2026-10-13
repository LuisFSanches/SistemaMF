import { Request, Response, NextFunction } from 'express';
import { DeleteProductVariantGroupService } from '../../services/productVariantGroup/DeleteProductVariantGroupService';

class DeleteProductVariantGroupController {
    async handle(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;

        const deleteProductVariantGroupService = new DeleteProductVariantGroupService();

        const result = await deleteProductVariantGroupService.execute({ id });

        return res.json(result);
    }
}

export { DeleteProductVariantGroupController };
