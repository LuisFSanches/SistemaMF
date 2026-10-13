import { Request, Response, NextFunction } from 'express';
import { UpdateProductColorService } from '../../services/productColor/UpdateProductColorService';

class UpdateProductColorController {
    async handle(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;
        const { name, hex, is_mixed, sort_order } = req.body;

        const updateProductColorService = new UpdateProductColorService();

        const color = await updateProductColorService.execute({
            id,
            name,
            hex,
            is_mixed,
            sort_order
        });

        return res.json(color);
    }
}

export { UpdateProductColorController };
