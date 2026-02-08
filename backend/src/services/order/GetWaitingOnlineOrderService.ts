import prismaClient from '../../prisma';
import { ErrorCodes } from "../../exceptions/root";
import { BadRequestException } from "../../exceptions/bad-request";

class GetWaitingOnlineOrderService{
    async execute(store_id?: string) {
        try {
            const whereClause: any = {
                status: 'WAITING_FOR_CLIENT'
            };

            // Filtro por loja (multi-tenancy)
            if (store_id) {
                whereClause.store_id = store_id;
            }

            const orders = await prismaClient.order.findMany({
                where: whereClause,
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
                }
            });

            return { orders };

        } catch(error: any) {
            throw new BadRequestException(
                "Client already created",
                ErrorCodes.USER_ALREADY_EXISTS
            );
        }
    }
}

export { GetWaitingOnlineOrderService }
