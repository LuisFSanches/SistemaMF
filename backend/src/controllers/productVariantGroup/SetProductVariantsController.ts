import { Request, Response, NextFunction } from 'express';
import { SetProductVariantsService } from '../../services/productVariantGroup/SetProductVariantsService';

class SetProductVariantsController {
    async handle(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;
        const { variants } = req.body;

        const setProductVariantsService = new SetProductVariantsService();

        const group = await setProductVariantsService.execute({
            group_id: id,
            variants
        });

        return res.json(group);
    }
}

export { SetProductVariantsController };
