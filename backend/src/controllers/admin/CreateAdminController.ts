import { Request, Response, NextFunction } from 'express';
import { BadRequestException } from "../../exceptions/bad-request";
import { CreateAdminService } from '../../services/admin/CreateAdminService';
import { ValidateSuperAdminService } from '../../services/admin/ValidateSuperAdminService';
import { IAdmin } from '../../interfaces/IAdmin';

class CreateAdminController{
	async handle(req: Request, res: Response, next: NextFunction) {
		const { username, name, password, role, super_admin_password }: IAdmin = req.body;
		const store_id = req.admin?.store_id || undefined;

		const validateSuperAdminService = new ValidateSuperAdminService();

		const superAdmin = req.admin;

		const validateSuperAdmin = await validateSuperAdminService.execute({
			currently_admin_password: superAdmin?.password,
			confirmation_password: super_admin_password
		});

		if (validateSuperAdmin.error) {
			next(new BadRequestException(
				validateSuperAdmin.message,
				validateSuperAdmin.code
			))

			return;
		}

		const createAdminService = new CreateAdminService();

		const admin = await createAdminService.execute({
			username,
			name,
			password,
			role,
			store_id
		});

		return res.json(admin)
	}
}

export { CreateAdminController }
