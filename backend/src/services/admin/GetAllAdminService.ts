import prismaClient from '../../prisma';
import { ErrorCodes } from "../../exceptions/root";
import { BadRequestException } from "../../exceptions/bad-request";

class GetAllAdminService{
	async execute() {
		try {
			const admins = await prismaClient.admin.findMany({
				select: {
					id: true,
					name: true,
					username: true,
					role: true
				}
			});

			return { admins };

			} catch(error: any) {
				throw new BadRequestException(
					error.message,
					ErrorCodes.SYSTEM_ERROR
				);
			}
		}
	}

export { GetAllAdminService }