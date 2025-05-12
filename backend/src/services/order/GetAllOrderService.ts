import prismaClient from '../../prisma';
import { ErrorCodes } from "../../exceptions/root";

class GetAllOrderService {
    async execute(page: number = 1, pageSize: number = 10, query?: string) {
        try {
            const skip = (page - 1) * pageSize;

            const filters = query
                ? {
                    client: {
                        OR: [
                            { first_name: { contains: query, mode: 'insensitive' } },
                            { last_name: { contains: query, mode: 'insensitive' } },
                            { phone_number: { contains: query, mode: 'insensitive' } }
                        ]
                    } as any
                }
                : {};

            const [orders, total] = await Promise.all([
                prismaClient.order.findMany({
                    where: filters,
                    include: {
                        client: true,
                        clientAddress: true,
                        createdBy: true,
                        orderItems: {
                            include: {
                                product: true
                            }
                        }
                    },
                    orderBy: {
                        code: 'desc'
                    },
                    skip,
                    take: pageSize
                }),
                prismaClient.order.count({
                    where: filters
                })
            ]);

            return {
                orders,
                total,
                currentPage: page,
                totalPages: Math.ceil(total / pageSize)
            };

        } catch (error: any) {
            return { error: true, message: error.message, code: ErrorCodes.SYSTEM_ERROR };
        }
    }
}

export { GetAllOrderService }
