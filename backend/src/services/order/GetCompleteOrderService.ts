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

            return order;
        }
        catch(error: any) {
            throw new BadRequestException(
                "Client already created",
                ErrorCodes.USER_ALREADY_EXISTS
            );
        }
    }
}

export { GetCompleteOrderService };
