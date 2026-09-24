import { Request, Response, NextFunction } from 'express';
import { ResendVerificationCodeEmailService } from '../../services/client/ResendVerificationCodeEmailService';

class ResendVerificationCodeEmailController {
    async handle(req: Request, res: Response, next: NextFunction) {
        const { phone_number, email } = req.body;

        const resendVerificationCodeEmailService = new ResendVerificationCodeEmailService();

        const result = await resendVerificationCodeEmailService.execute({
            phone_number,
            email,
        });

        return res.json(result);
    }
}

export { ResendVerificationCodeEmailController };
