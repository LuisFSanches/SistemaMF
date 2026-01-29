import prismaClient from "../../prisma";
import { ErrorCodes } from "../../exceptions/root";
import { BadRequestException } from "../../exceptions/bad-request";

class GetAllOrderToReceiveService {
    async execute(page: number = 1, pageSize: number = 10, query?: string, filter?: string, store_id?: string) {
        try {
            const skip = (page - 1) * pageSize;

            let whereClause: any = {};

            // Filtro por loja (multi-tenancy)
            if (store_id) {
                whereClause.store_id = store_id;
            }
            
            if (filter === 'active') {
                whereClause.is_archived = false;
            } else if (filter === 'archived') {
                whereClause.is_archived = true;
            }

            if (query) {
                const isNumericQuery = !isNaN(Number(query));
                const orConditions: any[] = [
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

            const [ordersToReceive, total, totalToReceiveResult] = await Promise.all([
                prismaClient.orderToReceive.findMany({
                    where: whereClause,
                    include: {
                        order: {
                            select: {
                                code: true,
                                total: true,
                                payment_received: true,
                                created_at: true,
                                client: {
                                    select: {
                                        id: true,
                                        first_name: true,
                                        last_name: true,
                                        phone_number: true
                                    }
                                }
                            }
                        }
                    },
                    orderBy: {
                        payment_due_date: 'asc'
                    },
                    skip,
                    take: pageSize
                }),
                prismaClient.orderToReceive.count({
                    where: whereClause
                }),
                prismaClient.orderToReceive.findMany({
                    where: {
                        is_archived: false,
                        ...(store_id ? { store_id } : {}),
                        order: {
                            payment_received: false
                        }
                    },
                    select: {
                        order: {
                            select: {
                                total: true
                            }
                        }
                    }
                })
            ]);

            const totalToReceive = totalToReceiveResult.reduce((sum, item) => {
                return sum + (item.order.total || 0);
            }, 0);

            return {
                ordersToReceive,
                total,
                totalToReceive,
                currentPage: page,
                totalPages: Math.ceil(total / pageSize)
            };
        } catch (error: any) {
            console.error("[GetAllOrderToReceiveService] Failed:", error);

            throw new BadRequestException(
                error.message,
                ErrorCodes.SYSTEM_ERROR
            );
        }
    }
}

export { GetAllOrderToReceiveService };
