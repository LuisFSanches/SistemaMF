import { Request, Response, NextFunction } from 'express';
import { CreateProductService } from '../../services/product/CreateProductService';
import { BadRequestException } from '../../exceptions/bad-request';

export class CreateProductController {
    async handle(req: Request, res: Response, next: NextFunction) {
        const { name, price, unity, stock } = req.body;

        const service = new CreateProductService();
        const result = await service.execute({ name, price, unity: unity, stock, enabled: true });

        if ('error' in result) {
            return next(new BadRequestException(result.message, result.code));
        }

        return res.status(201).json(result);
    }
}
