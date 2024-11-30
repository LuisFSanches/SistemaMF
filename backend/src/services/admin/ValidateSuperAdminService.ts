import { compare } from 'bcrypt'
import { ErrorCodes } from "../../exceptions/root";

class ValidateSuperAdminService{
	async execute({ currently_admin_password, confirmation_password }: any) {
		try {
			const comparePassword = await compare(confirmation_password, currently_admin_password);
			if (!comparePassword) {
				return { error: true, message: 'Invalid super admin password', code: ErrorCodes.UNAUTHORIZED }
			}

			return { error: false,  message: 'Invalid super admin password', code: ErrorCodes.AUTHORIZED };
		} catch(error: any) {
			return { error: true, message: error.message, code: ErrorCodes.SYSTEM_ERROR }
		}
	}
}

export { ValidateSuperAdminService }
