import { Request, Response, NextFunction } from 'express';
import { ValidateCodeService } from '../../services/client/ValidateCodeService';

class ValidateCodeController {
    async handle(req: Request, res: Response, next: NextFunction) {
        const { phone_number, code } = req.body;

        const validateCodeService = new ValidateCodeService();

        const result = await validateCodeService.execute({
            phone_number,
            code,
        });

        return res.json(result);
    }
}

export { ValidateCodeController };
