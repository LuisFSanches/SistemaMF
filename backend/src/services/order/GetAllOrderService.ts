import prismaClient from '../../prisma';
import { ErrorCodes } from "../../exceptions/root";
import { BadRequestException } from "../../exceptions/bad-request";
import { orderSearchFiltersSchema } from "../../schemas/order/orderSearchFilters";

class GetAllOrderService {
    async execute(page: number = 1, pageSize: number = 10, search?: unknown, startDate?: string, endDate?: string, store_id?: string) {
        const parsed = orderSearchFiltersSchema.safeParse(search ?? {});

        if (!parsed.success) {
            throw new BadRequestException(
                parsed.error.errors[0].message,
                ErrorCodes.VALIDATION_ERROR
            );
        }

        const { query, clientName, orderCode, phoneNumber, productName } = parsed.data;

        try {

            const skip = (page - 1) * pageSize;

            let filters: any = {};
            const andConditions: any[] = [];

            // Filtro por loja (multi-tenancy)
            if (store_id) {
                filters.store_id = store_id;
            }

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

            // Filtro genérico (busca rápida por nome, telefone ou código)
            if (query) {
                andConditions.push({
                    OR: [
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
                    ]
                });
            }

            // Filtro por nome do cliente
            if (clientName) {
                andConditions.push({
                    client: {
                        OR: [
                            { first_name: { contains: clientName, mode: 'insensitive' } },
                            { last_name: { contains: clientName, mode: 'insensitive' } }
                        ]
                    }
                });
            }

            // Filtro por telefone do cliente
            if (phoneNumber) {
                andConditions.push({
                    client: {
                        phone_number: { contains: phoneNumber, mode: 'insensitive' }
                    }
                });
            }

            // Filtro por código do pedido
            if (orderCode) {
                andConditions.push({
                    code: {
                        equals: isNaN(Number(orderCode)) ? undefined : Number(orderCode)
                    }
                });
            }

            // Filtro por produto (nome/descrição do produto ou descrição do pedido)
            if (productName) {
                andConditions.push({
                    OR: [
                        { description: { contains: productName, mode: 'insensitive' } },
                        {
                            orderItems: {
                                some: {
                                    OR: [
                                        { product: { name: { contains: productName, mode: 'insensitive' } } },
                                        { product: { description: { contains: productName, mode: 'insensitive' } } },
                                        { storeProduct: { description: { contains: productName, mode: 'insensitive' } } },
                                        { storeProduct: { product: { name: { contains: productName, mode: 'insensitive' } } } }
                                    ]
                                }
                            }
                        }
                    ]
                });
            }

            if (andConditions.length > 0) {
                filters.AND = andConditions;
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
                                storeProduct: {
                                    include: {
                                        product: {
                                            select: {
                                                name: true,
                                                image: true
                                            }
                                        }
                                    }
                                }
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
