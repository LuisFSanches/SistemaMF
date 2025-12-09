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
                whereClause.delivery_date = {
                    gte: new Date(startDate),
                    lte: new Date(endDate)
                };
            } else if (startDate) {
                whereClause.delivery_date = {
                    gte: new Date(startDate)
                };
            } else if (endDate) {
                whereClause.delivery_date = {
                    lte: new Date(endDate)
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
                                clientAddress: {
                                    select: {
                                        street: true,
                                        street_number: true,
                                        neighborhood: true,
                                        city: true
                                    }
                                }
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
