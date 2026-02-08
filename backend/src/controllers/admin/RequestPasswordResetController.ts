import { Request, Response, NextFunction } from 'express';
import { RequestPasswordResetService } from '../../services/admin/RequestPasswordResetService';

class RequestPasswordResetController {
    async handle(req: Request, res: Response, next: NextFunction) {
        const { email } = req.body;

        const requestPasswordResetService = new RequestPasswordResetService();

        const result = await requestPasswordResetService.execute({ email });

        return res.json(result);
    }
}

export { RequestPasswordResetController };
