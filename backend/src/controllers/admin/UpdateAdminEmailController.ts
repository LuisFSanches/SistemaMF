import { Request, Response, NextFunction } from 'express';
import { UpdateAdminEmailService } from '../../services/admin/UpdateAdminEmailService';

class UpdateAdminEmailController {
    async handle(req: Request, res: Response, next: NextFunction) {
        const { email, current_password } = req.body;
        const admin_id = req.admin?.id;

        if (!admin_id) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const updateAdminEmailService = new UpdateAdminEmailService();

        const result = await updateAdminEmailService.execute({
            admin_id,
            email,
            current_password
        });

        return res.json(result);
    }
}

export { UpdateAdminEmailController };
