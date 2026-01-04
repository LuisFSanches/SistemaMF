import { Request, Response, NextFunction } from 'express';
import { ResetPasswordByEmailService } from '../../services/admin/ResetPasswordByEmailService';

class ResetPasswordByEmailController {
    async handle(req: Request, res: Response, next: NextFunction) {
        const { email, new_password } = req.body;

        const resetPasswordByEmailService = new ResetPasswordByEmailService();

        const result = await resetPasswordByEmailService.execute({
            email,
            new_password
        });

        return res.json(result);
    }
}

export { ResetPasswordByEmailController };
