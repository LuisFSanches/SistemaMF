import prismaClient from '../../prisma';
import { ErrorCodes } from "../../exceptions/root";

class GetAllClientService{
    async execute(page: number = 1, pageSize: number = 10) {
        try {
            const skip = (page - 1) * pageSize;
            const [users, total] = await Promise.all([
                prismaClient.client.findMany({
                    skip,
                    take: pageSize
                }),
                prismaClient.client.count()
            ])

            return {
                users,
                total,
                currentPage: page,
                totalPages: Math.ceil(total / pageSize)
            };

        } catch(error: any) {
            return { error: true, message: error.message, code: ErrorCodes.SYSTEM_ERROR }
        }
    }
}

export { GetAllClientService }