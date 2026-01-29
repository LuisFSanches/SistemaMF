import prismaClient from "../../prisma";
import { ErrorCodes } from "../../exceptions/root";
import { BadRequestException } from "../../exceptions/bad-request";

class GetAllDeliveryMenService {
    async execute(page: number = 1, pageSize: number = 10, query?: string, store_id?: string) {
        try {
            const skip = (page - 1) * pageSize;
            let filters: any = {};

            // Filtro por loja (multi-tenancy)
            if (store_id) {
                filters.store_id = store_id;
            }

            if (query) {
                filters.OR = [
                    { name: { contains: query, mode: 'insensitive' } },
                    { phone_number: { contains: query, mode: 'insensitive' } }
                ];
            }

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
