import { Request, Response, NextFunction } from 'express';
import { ValidateStockService } from '../../services/stock-validation/ValidateStockService';

class ValidateStockController {
    async handle(req: Request, res: Response, next: NextFunction) {
        const { items } = req.body;

        const validateStockService = new ValidateStockService();

        const result = await validateStockService.execute({
            items
        });
        
        return res.json(result);
    }
}

export { ValidateStockController };
