import { Request, Response, NextFunction } from 'express';
import { GetProductByIdService } from '../../services/product/GetProductByIdService';

class GetProductByIdController {
    async handle(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;

        const getProductByIdService = new GetProductByIdService();
        const product = await getProductByIdService.execute({ id });

        return res.json(product);
    }
}

export { GetProductByIdController };
