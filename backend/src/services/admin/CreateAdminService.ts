import { IAdmin } from "../../interfaces/IAdmin";
import prismaClient from '../../prisma';
import { hash } from 'bcrypt'
import { ErrorCodes } from "../../exceptions/root";
import { BadRequestException } from "../../exceptions/bad-request";
import { createAdminSchema } from "../../schemas/admin/createAdmin";

class CreateAdminService{
	async execute({ username, name, password, role, email, store_id }: IAdmin) {
		// 1. Validação com Zod
		const parsed = createAdminSchema.safeParse({ 
			username, 
			name, 
			password, 
			role, 
			email, 
			store_id 
		});

		if (!parsed.success) {
			throw new BadRequestException(
				parsed.error.errors[0].message,
				ErrorCodes.VALIDATION_ERROR
			);
		}

		// 2. Verificar se o admin já existe
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

		// 3. Criar admin
		try {
			const newAdmin = await prismaClient.admin.create({
				data: {
					username,
					name,
					password: hashedPassword,
					role,
					email,
					store_id
				}
			})

			return newAdmin;

		} catch(error: any) {
			console.error("[CreateAdminService] Failed:", error);
			
			throw new BadRequestException(
                error.message,
                ErrorCodes.SYSTEM_ERROR
            );
		}
	}
}

export { CreateAdminService }
