import prismaClient from '../../prisma';
import { ErrorCodes } from "../../exceptions/root";
import { BadRequestException } from "../../exceptions/bad-request";

class GetAllAdminService{
	async execute(store_id?: string) {
		try {
			const whereClause: any = {};
			if (store_id) {
				whereClause.store_id = store_id;
			}

			const admins = await prismaClient.admin.findMany({
				where: whereClause,
				select: {
					id: true,
					name: true,
					username: true,
					role: true,
					store_id: true
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