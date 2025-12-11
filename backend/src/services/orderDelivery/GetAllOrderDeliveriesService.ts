import prismaClient from "../../prisma";
import { ErrorCodes } from "../../exceptions/root";
import { BadRequestException } from "../../exceptions/bad-request";

class GetAllOrderDeliveriesService {
    async execute(page: number = 1, pageSize: number = 10, query?: string, filter?: string, startDate?: string, endDate?: string) {
        try {
            const skip = (page - 1) * pageSize;

            let whereClause: any = {};
            
            if (filter === 'active') {
                whereClause.is_archived = false;
            } else if (filter === 'archived') {
                whereClause.is_archived = true;
            }

            if (startDate && endDate) {
                const start = new Date(startDate + 'T00:00:00-03:00');
                const end = new Date(endDate + 'T23:59:59-03:00');
                
                whereClause.delivery_date = {
                    gte: start,
                    lte: end
                };
            } else if (startDate) {
                const start = new Date(startDate + 'T00:00:00-03:00');
                
                whereClause.delivery_date = {
                    gte: start
                };
            } else if (endDate) {
                const end = new Date(endDate + 'T23:59:59-03:00');
                
                whereClause.delivery_date = {
                    lte: end
                };
            }

            if (query) {
                const isNumericQuery = !isNaN(Number(query));
                const orConditions: any[] = [
                    {
                        deliveryMan: {
                            OR: [
                                { name: { contains: query, mode: 'insensitive' } },
                                { phone_number: { contains: query, mode: 'insensitive' } }
                            ]
                        }
                    },
                    {
                        order: {
                            client: {
                                OR: [
                                    { first_name: { contains: query, mode: 'insensitive' } },
                                    { last_name: { contains: query, mode: 'insensitive' } },
                                    { phone_number: { contains: query, mode: 'insensitive' } }
                                ]
                            }
                        }
                    }
                ];

                if (isNumericQuery) {
                    orConditions.push({
                        order: {
                            code: { equals: Number(query) }
                        }
                    });
                }

                whereClause.OR = orConditions;
            }

            const [orderDeliveries, total] = await Promise.all([
                prismaClient.orderDelivery.findMany({
                    where: whereClause,
                    include: {
                        order: {
                            select: {
                                code: true,
                                delivery_fee: true,
                                client: {
                                    select: {
                                        first_name: true,
                                        last_name: true,
                                        phone_number: true
                                    }
                                },
                            }
                        },
                        deliveryMan: {
                            select: {
                                name: true,
                                phone_number: true,
                                id: true
                            }
                        }
                    },
                    orderBy: {
                        delivery_date: 'asc'
                    },
                    skip,
                    take: pageSize
                }),
                prismaClient.orderDelivery.count({
                    where: whereClause
                })
            ]);
            
            return {
                orderDeliveries,
                total,
                currentPage: page,
                totalPages: Math.ceil(total / pageSize)
            };
        } catch (error: any) {
            console.error("[GetAllOrderDeliveriesService] Failed:", error);

            throw new BadRequestException(
                error.message,
                ErrorCodes.SYSTEM_ERROR
            );
        }
    }
}

export { GetAllOrderDeliveriesService };
