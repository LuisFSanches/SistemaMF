import prismaClient from '../../prisma';
import { ErrorCodes } from "../../exceptions/root";
import { BadRequestException } from "../../exceptions/bad-request";

class GetAllClientService{
    async execute(page: number = 1, pageSize: number = 10, query?: string) {
        try {
            const skip = (page - 1) * pageSize;
            const filters = query
				? {
                    OR: [
                        { first_name: { contains: query, mode: 'insensitive' } },
                        { last_name: { contains: query, mode: 'insensitive' } },
                        { phone_number: { contains: query, mode: 'insensitive' } }
                    ]
				}
				: {};

            const [users, total] = await Promise.all([
                prismaClient.client.findMany({
                    where: filters as any,
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
            throw new BadRequestException(
                error.message,
                ErrorCodes.SYSTEM_ERROR
            )
        }
    }
}

export { GetAllClientService }