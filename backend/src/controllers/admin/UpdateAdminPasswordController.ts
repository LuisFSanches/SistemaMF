import { Request, Response, NextFunction } from 'express';
import { UpdateAdminPasswordService } from '../../services/admin/UpdateAdminPasswordService';

class UpdateAdminPasswordController {
    async handle(req: Request, res: Response, next: NextFunction) {
        const { admin_id, new_password } = req.body;

        const updateAdminPasswordService = new UpdateAdminPasswordService();

        const result = await updateAdminPasswordService.execute({
            admin_id,
            new_password
        });

        return res.json(result);
    }
}

export { UpdateAdminPasswordController };
