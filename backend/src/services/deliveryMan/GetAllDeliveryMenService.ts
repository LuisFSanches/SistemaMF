import prismaClient from "../../prisma";
import { ErrorCodes } from "../../exceptions/root";
import { BadRequestException } from "../../exceptions/bad-request";

class GetAllDeliveryMenService {
    async execute(page: number = 1, pageSize: number = 10, query?: string) {
        try {
            const skip = (page - 1) * pageSize;
            const filters = query
                ? {
                    OR: [
                        { name: { contains: query, mode: 'insensitive' } },
                        { phone_number: { contains: query, mode: 'insensitive' } }
                    ]
                }
                : {};

            const [deliveryMen, total] = await Promise.all([
                prismaClient.deliveryMan.findMany({
                    where: filters as any,
                    skip,
                    take: pageSize,
                    orderBy: {
                        name: 'asc'
                    }
                }),
                prismaClient.deliveryMan.count({ where: filters as any })
            ]);
            
            return {
                deliveryMen,
                total,
                currentPage: page,
                totalPages: Math.ceil(total / pageSize)
            };
        } catch (error: any) {
            console.error("[GetAllDeliveryMenService] Failed:", error);

            throw new BadRequestException(
                error.message,
                ErrorCodes.SYSTEM_ERROR
            );
        }
    }
}

export { GetAllDeliveryMenService };
