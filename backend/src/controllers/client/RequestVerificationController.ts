import { Request, Response, NextFunction } from 'express';
import { RequestVerificationService } from '../../services/client/RequestVerificationService';

class RequestVerificationController {
    async handle(req: Request, res: Response, next: NextFunction) {
        const { phone_number, email } = req.body;

        const requestVerificationService = new RequestVerificationService();

        const result = await requestVerificationService.execute({
            phone_number,
            email,
        });

        return res.json(result);
    }
}

export { RequestVerificationController };
