import { compare } from 'bcrypt'
import { ErrorCodes } from "../../exceptions/root";
import { BadRequestException } from "../../exceptions/bad-request";

class ValidateSuperAdminService{
	async execute({ currently_admin_password, confirmation_password }: any) {
		try {
			const comparePassword = await compare(confirmation_password, currently_admin_password);
			if (!comparePassword) {
				throw new BadRequestException(
					'Invalid super admin password',
					ErrorCodes.UNAUTHORIZED
				)
			}

			return { error: false,  message: 'Invalid super admin password', code: ErrorCodes.AUTHORIZED };
		} catch(error: any) {
			throw new BadRequestException(
				error.message,
				ErrorCodes.SYSTEM_ERROR
			);
		}
	}
}

export { ValidateSuperAdminService }
