import prismaClient from '../../prisma';
import { ErrorCodes } from "../../exceptions/root";
import { BadRequestException } from "../../exceptions/bad-request";
import { orderSearchFiltersSchema } from "../../schemas/order/orderSearchFilters";

// Remove tudo que não for dígito, para comparar telefones digitados com ou sem formatação
const onlyDigits = (value: string) => value.replace(/\D/g, '');

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

            // Busca por nome de cliente/produto ignora acentos (usa unaccent do Postgres)
            if (clientName) {
                const clientOrderIds = await prismaClient.$queryRaw<{ id: string }[]>`
                    SELECT o.id
                    FROM orders o
                    INNER JOIN clients c ON c.id = o.client_id
                    WHERE unaccent(c.first_name) ILIKE unaccent(${'%' + clientName + '%'})
                       OR unaccent(c.last_name) ILIKE unaccent(${'%' + clientName + '%'})
                `;
                andConditions.push({ id: { in: clientOrderIds.map(o => o.id) } });
            }

            if (productName) {
                const productOrderIds = await prismaClient.$queryRaw<{ id: string }[]>`
                    SELECT DISTINCT o.id
                    FROM orders o
                    LEFT JOIN order_items oi ON oi.order_id = o.id
                    LEFT JOIN products p ON p.id = oi.product_id
                    LEFT JOIN store_products sp ON sp.id = oi.store_product_id
                    LEFT JOIN products sp_p ON sp_p.id = sp.product_id
                    WHERE unaccent(o.description) ILIKE unaccent(${'%' + productName + '%'})
                       OR unaccent(p.name) ILIKE unaccent(${'%' + productName + '%'})
                       OR unaccent(p.description) ILIKE unaccent(${'%' + productName + '%'})
                       OR unaccent(sp.description) ILIKE unaccent(${'%' + productName + '%'})
                       OR unaccent(sp_p.name) ILIKE unaccent(${'%' + productName + '%'})
                `;
                andConditions.push({ id: { in: productOrderIds.map(o => o.id) } });
            }

            if (query) {
                const queryOrderIds = await prismaClient.$queryRaw<{ id: string }[]>`
                    SELECT o.id
                    FROM orders o
                    INNER JOIN clients c ON c.id = o.client_id
                    WHERE unaccent(c.first_name) ILIKE unaccent(${'%' + query + '%'})
                       OR unaccent(c.last_name) ILIKE unaccent(${'%' + query + '%'})
                       OR regexp_replace(c.phone_number, '\\D', '', 'g') LIKE ${'%' + onlyDigits(query) + '%'}
                       OR o.code::text = ${query}
                `;
                andConditions.push({ id: { in: queryOrderIds.map(o => o.id) } });
            }

            // Telefone comparado ignorando formatação (espaços, traços, parênteses)
            if (phoneNumber) {
                const phoneOrderIds = await prismaClient.$queryRaw<{ id: string }[]>`
                    SELECT o.id
                    FROM orders o
                    INNER JOIN clients c ON c.id = o.client_id
                    WHERE regexp_replace(c.phone_number, '\\D', '', 'g') LIKE ${'%' + onlyDigits(phoneNumber) + '%'}
                `;
                andConditions.push({ id: { in: phoneOrderIds.map(o => o.id) } });
            }

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

            // Filtro por código do pedido
            if (orderCode) {
                andConditions.push({
                    code: {
                        equals: isNaN(Number(orderCode)) ? undefined : Number(orderCode)
                    }
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
