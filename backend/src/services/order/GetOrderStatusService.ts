import prismaClient from "../../prisma";
import { ErrorCodes } from "../../exceptions/root";
import { BadRequestException } from "../../exceptions/bad-request";

interface IGetOrderStatus {
    order_id: string;
}

class GetOrderStatusService {
    async execute(data: IGetOrderStatus) {
        const { order_id } = data;

        if (!order_id) {
            throw new BadRequestException(
                "Order ID is required",
                ErrorCodes.VALIDATION_ERROR
            );
        }

        try {
            const orderDetails = await prismaClient.order.findUnique({
                where: { id: order_id },
                include: {
                    orderItems: {
                        include: {
                            product: {
                                select: {
                                    id: true,
                                    name: true,
                                    description: true,
                                    image: true,
                                }
                            },
                            storeProduct: {
                                include: {
                                    product: {
                                        select: {
                                            id: true,
                                            name: true,
                                            description: true,
                                            image: true,
                                        }
                                    }
                                }
                            }
                        }
                    },
                    clientAddress: true,
                    client: {
                        select: {
                            first_name: true,
                            last_name: true,
                            phone_number: true,
                            email: true,
                        }
                    },
                    store: {
                        select: {
                            name: true,
                            slug: true,
                            phone_number: true,
                            email: true,
                        }
                    }
                }
            });

            if (!orderDetails) {
                throw new BadRequestException(
                    "Order not found",
                    ErrorCodes.BAD_REQUEST
                );
            }

            const items = orderDetails.orderItems.map((item) => {
                const productInfo = item.product || item.storeProduct?.product;
                
                return {
                    id: item.id,
                    product_id: productInfo?.id || null,
                    product_name: productInfo?.name || 'Produto',
                    quantity: item.quantity,
                    unit_price: item.price,
                    total_price: item.price * item.quantity,
                    image_url: productInfo?.image || null,
                    description: productInfo?.description || null,
                };
            });

            let orderStatus = 'pending';
            if (orderDetails.status === 'OPENED') {
                orderStatus = 'approved';
            } else if (orderDetails.status === 'IN_PROGRESS') {
                orderStatus = 'in_progress';
            } else if (orderDetails.status === 'IN_DELIVERY') {
                orderStatus = 'in_delivery';
            } else if (orderDetails.status === 'DONE') {
                orderStatus = 'done';
            } else if (orderDetails.status === 'CANCELLED') {
                orderStatus = 'cancelled';
            }

            return {
                // 1. Informações básicas do pedido
                order: {
                    id: orderDetails.id,
                    order_id: orderDetails.code,
                    order_code: String(orderDetails.code),
                    status: orderStatus,
                    created_at: orderDetails.created_at.toISOString(),
                },

                // 2. Itens do pedido
                items: items,

                // 3. Valores financeiros
                financial: {
                    subtotal: orderDetails.products_value,
                    delivery_fee: orderDetails.delivery_fee,
                    discount: orderDetails.discount,
                    total_amount: orderDetails.total,
                },

                // 4. Informações de entrega
                delivery: {
                    type: orderDetails.pickup_on_store 
                        ? 'pickup' 
                        : orderDetails.type_of_delivery || 'delivery',
                    is_pickup: orderDetails.pickup_on_store,
                    address: orderDetails.pickup_on_store ? null : {
                        street: orderDetails.clientAddress.street,
                        number: orderDetails.clientAddress.street_number,
                        complement: orderDetails.clientAddress.complement,
                        neighborhood: orderDetails.clientAddress.neighborhood,
                        city: orderDetails.clientAddress.city,
                        state: orderDetails.clientAddress.state,
                        zip_code: orderDetails.clientAddress.postal_code,
                        reference: orderDetails.clientAddress.reference_point,
                    },
                    delivery_date: orderDetails.delivery_date.toISOString(),
                    receiver_name: orderDetails.receiver_name || 
                        `${orderDetails.client.first_name} ${orderDetails.client.last_name}`,
                    receiver_phone: orderDetails.receiver_phone || 
                        orderDetails.client.phone_number,
                },

                // 5. Informações de pagamento (baseado no banco de dados)
                payment: {
                    id: orderDetails.id, // Usar o ID do pedido como referência
                    method_id: orderDetails.payment_method || 'not_specified',
                    method_type: orderDetails.payment_method || 'not_specified',
                    payment_brand: orderDetails.payment_method || 'not_specified',
                    status: orderStatus, // Status do pedido no banco
                    status_detail: orderDetails.status,
                    transaction_amount: orderDetails.total,
                    currency_id: 'BRL',
                    date_approved: orderDetails.payment_received 
                        ? orderDetails.created_at.toISOString() 
                        : null,
                    date_created: orderDetails.created_at.toISOString(),
                    payer: {
                        email: orderDetails.client.email,
                        first_name: orderDetails.client.first_name,
                        last_name: orderDetails.client.last_name,
                    }
                },

                // 6. Observações e informações adicionais
                additional_info: {
                    notes: orderDetails.additional_information,
                    description: orderDetails.description,
                    card_message: orderDetails.has_card ? {
                        has_card: true,
                        message: orderDetails.card_message,
                        from: orderDetails.card_from,
                        to: orderDetails.card_to,
                    } : {
                        has_card: false,
                    }
                },

                // 7. Informações do cliente
                client: {
                    first_name: orderDetails.client.first_name,
                    last_name: orderDetails.client.last_name,
                    phone_number: orderDetails.client.phone_number,
                    email: orderDetails.client.email,
                },

                // 8. Informações da loja (se houver)
                store: orderDetails.store ? {
                    name: orderDetails.store.name,
                    slug: orderDetails.store.slug,
                    phone_number: orderDetails.store.phone_number,
                    email: orderDetails.store.email,
                } : null,
            };

        } catch (error: any) {
            console.error("[GetOrderStatusService] Failed:", error);

            if (error instanceof BadRequestException) {
                throw error;
            }

            throw new BadRequestException(
                error.message || "Failed to get order status",
                ErrorCodes.SYSTEM_ERROR
            );
        }
    }
}

export { GetOrderStatusService };
