import { Request, Response, NextFunction } from 'express';
import { BadRequestException } from "../../exceptions/bad-request";
import { UpdateAdminService } from '../../services/admin/UpdateAdminService';
import { ValidateSuperAdminService } from '../../services/admin/ValidateSuperAdminService';
import { IAdmin } from '../../interfaces/IAdmin';

class UpdateAdminController{
	async handle(req: Request, res: Response, next: NextFunction) {
		const { id, username, name, password, role, email, super_admin_password }: IAdmin = req.body;
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

		const updateAdminService = new UpdateAdminService();

		const admin = await updateAdminService.execute({
			id,
			username,
			name,
			password,
			role,
			email,
			store_id
		});

		return res.json(admin)
	}
}

export { UpdateAdminController }
