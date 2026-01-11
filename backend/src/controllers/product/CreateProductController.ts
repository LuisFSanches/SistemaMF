import { Request, Response, NextFunction } from 'express';
import { CreateProductService } from '../../services/product/CreateProductService';

export class CreateProductController {
    async handle(req: Request, res: Response, next: NextFunction) {
        const { name, price, unity, stock } = req.body;

        const service = new CreateProductService();
        const result = await service.execute({ name, price, unity: unity, stock, enabled: true });

        return res.status(201).json(result);
    }
}
