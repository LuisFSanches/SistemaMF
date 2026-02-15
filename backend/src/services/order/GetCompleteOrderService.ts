import prismaClient from '../../prisma';
import { ErrorCodes } from "../../exceptions/root";
import { BadRequestException } from "../../exceptions/bad-request";

class GetCompleteOrderService {
    async execute(id: any, store_id?: string) {
        try {
            const whereClause: any = {
                id: id
            };

            // Filtro por loja (multi-tenancy)
            if (store_id) {
                whereClause.store_id = store_id;
            }

            const order = await prismaClient.order.findFirst({
                where: whereClause,
                include: {
                    store: {
                        select: {
                            name: true,
                            logo: true,
                            cnpj: true,
                            phone_number: true,
                        }
                    },
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
                            },
                        }
                    }
                }
            });

            if (!order) {
                return { error: true, message: 'Order not found', code: ErrorCodes.BAD_REQUEST }
            }

            // Buscar dados do cliente pelo receiver_phone
            let clientData = null;
            if (order.receiver_phone) {
                const client = await prismaClient.client.findFirst({
                    where: {
                        phone_number: order.receiver_phone
                    },
                    select: {
                        id: true,
                        first_name: true,
                        last_name: true,
                        phone_number: true,
                        email: true,
                        addresses: {
                            select: {
                                id: true,
                                street: true,
                                street_number: true,
                                complement: true,
                                neighborhood: true,
                                reference_point: true,
                                city: true,
                                state: true,
                                postal_code: true,
                                country: true,
                                created_at: true,
                                updated_at: true
                            }
                        }
                    }
                });

                clientData = client;
            }

            return {
                ...order,
                client: clientData
            };
        }
        catch(error: any) {
            throw new BadRequestException(
                "Error fetching order",
                ErrorCodes.SYSTEM_ERROR
            );
        }
    }
}

export { GetCompleteOrderService };
