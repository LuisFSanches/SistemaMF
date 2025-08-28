import { IAdmin } from "../../interfaces/IAdmin";
import prismaClient from '../../prisma';
import { hash } from 'bcrypt'
import { ErrorCodes } from "../../exceptions/root";
import { BadRequestException } from "../../exceptions/bad-request";

class UpdateAdminService{
	async execute({ id, username, name, password, role }: IAdmin) {		
		try {
			let data = {
				username,
				name,
				role
			} as any;
	
			if (password) {
				const hashedPassword = await hash(password, 10);
	
				data = {
					...data,
					password: hashedPassword
				};
			}
			
			const updatedAdmin =await prismaClient.admin.update({
				where: {
					id: id
				},
				data: data
			})

			return updatedAdmin;

		} catch(error: any) {
            throw new BadRequestException(
                error.message,
                ErrorCodes.SYSTEM_ERROR
            );
		}
	}
}

export { UpdateAdminService }
