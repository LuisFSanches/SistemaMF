import prismaClient from "../../prisma";
import { ErrorCodes } from "../../exceptions/root";
import { BadRequestException } from "../../exceptions/bad-request";

interface GetOrderDeliveryRequest {
    id: string
    store_id?: string
}

class GetOrderDeliveryService {
    async execute({ id, store_id }: GetOrderDeliveryRequest) {
        try {
            const whereClause: any = { id };
            if (store_id) {
                whereClause.store_id = store_id;
            }

            const orderDelivery = await prismaClient.orderDelivery.findFirst({
                where: whereClause,
                include: {
                    order: {
                        select: {
                            code: true,
                            total: true,
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
                                    complement: true,
                                    neighborhood: true,
                                    reference_point: true,
                                    city: true,
                                    state: true
                                }
                            }
                        }
                    },
                    deliveryMan: {
                        select: {
                            name: true,
                            phone_number: true
                        }
                    }
                }
            });

            if (!orderDelivery) {
                throw new BadRequestException(
                    "Order delivery not found",
                    ErrorCodes.USER_NOT_FOUND
                );
            }
            
            return orderDelivery;
        } catch (error: any) {
            console.error("[GetOrderDeliveryService] Failed:", error);

            throw new BadRequestException(
                error.message,
                ErrorCodes.SYSTEM_ERROR
            );
        }
    }
}

export { GetOrderDeliveryService };
