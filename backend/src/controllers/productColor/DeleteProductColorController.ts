import { Request, Response, NextFunction } from 'express';
import { DeleteProductColorService } from '../../services/productColor/DeleteProductColorService';

class DeleteProductColorController {
    async handle(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;

        const deleteProductColorService = new DeleteProductColorService();

        const result = await deleteProductColorService.execute({ id });

        return res.json(result);
    }
}

export { DeleteProductColorController };
