import { IAdmin } from "../../interfaces/IAdmin";
import prismaClient from '../../prisma';
import { hash } from 'bcrypt'
import { ErrorCodes } from "../../exceptions/root";
import { BadRequestException } from "../../exceptions/bad-request";

class CreateAdminService{
	async execute({ username, name, password, role, store_id }: IAdmin) {
		const hashedPassword = await hash(password, 10);

		const admin = await prismaClient.admin.findFirst({
			where: {
				username
			}
		})

		if (admin) {
			throw new BadRequestException(
                "Admin already created",
                ErrorCodes.USER_ALREADY_EXISTS
            );
		}

		try {
			const newAdmin =await prismaClient.admin.create({
				data: {
					username,
					name,
					password: hashedPassword,
					role,
					store_id
				}
			})

			return newAdmin;

		} catch(error: any) {
			throw new BadRequestException(
                error.message,
                ErrorCodes.SYSTEM_ERROR
            );
		}
	}
}

export { CreateAdminService }
