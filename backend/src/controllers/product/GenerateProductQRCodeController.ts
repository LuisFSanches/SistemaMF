import { Request, Response, NextFunction } from 'express';
import { GenerateProductQRCodeService } from '../../services/product/GenerateProductQRCodeService';

class GenerateProductQRCodeController {
    async handle(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;

        const generateProductQRCodeService = new GenerateProductQRCodeService();
        const product = await generateProductQRCodeService.execute({ id });

        return res.json(product);
    }
}

export { GenerateProductQRCodeController };
