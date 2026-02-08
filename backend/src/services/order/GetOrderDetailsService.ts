import prismaClient from '../../prisma';
import { ErrorCodes } from "../../exceptions/root";
import { BadRequestException } from "../../exceptions/bad-request";
import { IOrderDetails } from "../../interfaces/IOrderDetails";

class GetOrderDetailsService {
    async execute(id: string, store_id?: string): Promise<IOrderDetails> {
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
                    },
                    orderDeliveries: {
                        include: {
                            deliveryMan: true
                        }
                    }
                }
            });

            if (!order) {
                throw new BadRequestException(
                    "Order not found",
                    ErrorCodes.BAD_REQUEST
                );
            }

            // Estruturar o retorno conforme a interface
            const orderDetails: IOrderDetails = {
                orderInfo: {
                    code: order.code,
                    description: order.description,
                    additional_information: order.additional_information,
                    delivery_date: order.delivery_date,
                    status: order.status,
                    is_delivery: order.is_delivery,
                    online_order: order.online_order,
                    store_front_order: order.store_front_order,
                },
                orderValues: {
                    products_value: order.products_value,
                    discount: order.discount,
                    delivery_fee: order.delivery_fee,
                    total: order.total,
                    payment_method: order.payment_method,
                    payment_received: order.payment_received
                },
                cardDetails: order.has_card ? {
                    card_from: order.card_from,
                    card_to: order.card_to,
                    card_message: order.card_message
                } : null,
                clientInfo: {
                    id: order.client.id,
                    first_name: order.client.first_name,
                    last_name: order.client.last_name,
                    phone_number: order.client.phone_number,
                    address: {
                        street: order.clientAddress.street,
                        street_number: order.clientAddress.street_number,
                        complement: order.clientAddress.complement,
                        neighborhood: order.clientAddress.neighborhood,
                        reference_point: order.clientAddress.reference_point,
                        city: order.clientAddress.city,
                        state: order.clientAddress.state,
                        postal_code: order.clientAddress.postal_code
                    }
                },
                deliveryManInfo: order.is_delivery && order.orderDeliveries.length > 0 ? {
                    id: order.orderDeliveries[0].deliveryMan.id,
                    name: order.orderDeliveries[0].deliveryMan.name,
                    phone_number: order.orderDeliveries[0].deliveryMan.phone_number
                } : null,
                createdBy: order.createdBy ? {
                    id: order.createdBy.id,
                    name: order.createdBy.name,
                    username: order.createdBy.username
                } : null,
                orderItems: order.orderItems
            };

            return orderDetails;
        }
        catch(error: any) {
            console.error("[GetOrderDetailsService] Failed:", error);

            throw new BadRequestException(
                error.message || "Failed to get order details",
                ErrorCodes.SYSTEM_ERROR
            );
        }
    }
}

export { GetOrderDetailsService };
