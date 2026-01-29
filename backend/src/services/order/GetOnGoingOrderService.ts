import prismaClient from '../../prisma';
import { ErrorCodes } from "../../exceptions/root";
import { BadRequestException } from "../../exceptions/bad-request";

class GetOnGoingOrderService {
    async execute(store_id?: string) {
        try {
            const whereClause: any = {
                status: {
                    notIn: ['FINISHED', 'CANCELED', 'DONE']
                }
            };

            // Filtro por loja (multi-tenancy)
            if (store_id) {
                whereClause.store_id = store_id;
            }

            const orders = await prismaClient.order.findMany({
                where: whereClause,
                orderBy: {
                    code: 'desc'
                },
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
                }
            });
            
            return orders;
        } catch(error: any) {
            throw new BadRequestException(
                error.message,
                ErrorCodes.SYSTEM_ERROR
            );
        }
    }
}

export { GetOnGoingOrderService };
