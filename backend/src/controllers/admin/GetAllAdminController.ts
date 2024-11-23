import { Request, Response, NextFunction } from 'express'
import { GetAllAdminService } from '../../services/admin/GetAllAdminService';
import { BadRequestException } from '../../exceptions/bad-request';

class GetAllAdminController{
	async handle(req: Request, res: Response, next: NextFunction) {
		const getAllAdminService = new GetAllAdminService();
		const admins = await getAllAdminService.execute();

		if ('error' in admins && admins.error) {
			next(new BadRequestException(
				admins.message,
				admins.code
			));

			return;
		}

		return res.json(admins);
	}
}

export { GetAllAdminController }