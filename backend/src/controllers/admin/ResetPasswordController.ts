import { Request, Response, NextFunction } from 'express';
import { ResetPasswordService } from '../../services/admin/ResetPasswordService';

class ResetPasswordController {
    async handle(req: Request, res: Response, next: NextFunction) {
        const { token, new_password } = req.body;

        const resetPasswordService = new ResetPasswordService();

        const result = await resetPasswordService.execute({
            token,
            new_password
        });

        return res.json(result);
    }
}

export { ResetPasswordController };
