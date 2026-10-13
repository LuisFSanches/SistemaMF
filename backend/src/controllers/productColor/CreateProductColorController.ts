import { Request, Response, NextFunction } from 'express';
import { CreateProductColorService } from '../../services/productColor/CreateProductColorService';

class CreateProductColorController {
    async handle(req: Request, res: Response, next: NextFunction) {
        const { name, hex, is_mixed, sort_order } = req.body;

        const createProductColorService = new CreateProductColorService();

        const color = await createProductColorService.execute({
            name,
            hex,
            is_mixed,
            sort_order
        });

        return res.json(color);
    }
}

export { CreateProductColorController };
