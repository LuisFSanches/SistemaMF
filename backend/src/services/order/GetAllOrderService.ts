import prismaClient from '../../prisma';
import { ErrorCodes } from "../../exceptions/root";
import { BadRequestException } from "../../exceptions/bad-request";

class GetAllOrderService {
    async execute(page: number = 1, pageSize: number = 10, query?: string, startDate?: string, endDate?: string) {
        try {
            const skip = (page - 1) * pageSize;

            let filters: any = {};

            // Filtro por data
            if (startDate && endDate) {
                const start = new Date(startDate + 'T00:00:00-03:00');
                const end = new Date(endDate + 'T23:59:59-03:00');
                
                filters.delivery_date = {
                    gte: start,
                    lte: end
                };
            } else if (startDate) {
                const start = new Date(startDate + 'T00:00:00-03:00');
                
                filters.delivery_date = {
                    gte: start
                };
            } else if (endDate) {
                const end = new Date(endDate + 'T23:59:59-03:00');
                
                filters.delivery_date = {
                    lte: end
                };
            }

            // Filtro por query (busca de texto)
            if (query) {
                filters.OR = [
                    {
                        client: {
                            OR: [
                                { first_name: { contains: query, mode: 'insensitive' } },
                                { last_name: { contains: query, mode: 'insensitive' } },
                                { phone_number: { contains: query, mode: 'insensitive' } }
                            ]
                        }
                    },
                    {
                        code: {
                            equals: isNaN(Number(query)) ? undefined : Number(query)
                        }
                    }
                ];
            }

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
            throw new BadRequestException(
                error.message,
                ErrorCodes.SYSTEM_ERROR
            );
        }
    }
}

export { GetAllOrderService }
