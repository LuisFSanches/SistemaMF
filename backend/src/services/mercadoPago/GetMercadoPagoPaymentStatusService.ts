import { MercadoPagoConfig, Payment } from 'mercadopago';
import prismaClient from "../../prisma";
import { ErrorCodes } from "../../exceptions/root";
import { BadRequestException } from "../../exceptions/bad-request";

interface IGetPaymentStatus {
    payment_id: string;
    store_slug?: string;
}

class GetMercadoPagoPaymentStatusService {
    async execute(data: IGetPaymentStatus) {
        const { payment_id, store_slug } = data;

        if (!payment_id) {
            throw new BadRequestException(
                "Payment ID is required",
                ErrorCodes.VALIDATION_ERROR
            );
        }

        try {
            // Determinar qual access token usar
            let accessToken = process.env.MP_ACCESS_TOKEN;

            if (store_slug) {
                const store = await prismaClient.store.findUnique({
                    where: { slug: store_slug }
                });

                if (store?.mp_access_token) {
                    accessToken = store.mp_access_token;
                }
            }

            if (!accessToken) {
                throw new BadRequestException(
                    "Mercado Pago credentials not configured",
                    ErrorCodes.BAD_REQUEST
                );
            }

            // Configurar cliente Mercado Pago
            const client = new MercadoPagoConfig({ 
                accessToken: accessToken,
                options: { timeout: 5000 }
            });

            const payment = new Payment(client);

            // Buscar detalhes do pagamento
            const paymentInfo = await payment.get({ id: payment_id });

            if (!paymentInfo) {
                throw new BadRequestException(
                    "Payment not found",
                    ErrorCodes.BAD_REQUEST
                );
            }

            // Buscar informações completas do pedido no banco
            let orderDetails = null;

            if (paymentInfo.external_reference) {
                orderDetails = await prismaClient.order.findUnique({
                    where: { id: paymentInfo.external_reference },
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
            }

            // Se não encontrou o pedido, retornar apenas informações do pagamento
            if (!orderDetails) {
                return {
                    payment: {
                        id: String(paymentInfo.id),
                        status: paymentInfo.status,
                        status_detail: paymentInfo.status_detail,
                        method_id: paymentInfo.payment_method_id,
                        method_type: paymentInfo.payment_type_id,
                        payment_brand: paymentInfo.payment_method_id,
                        transaction_amount: paymentInfo.transaction_amount,
                        currency_id: paymentInfo.currency_id,
                        date_approved: paymentInfo.date_approved,
                        date_created: paymentInfo.date_created,
                        payer: paymentInfo.payer ? {
                            email: paymentInfo.payer.email,
                            first_name: paymentInfo.payer.first_name,
                            last_name: paymentInfo.payer.last_name,
                        } : null,
                    }
                };
            }

            // Montar informações dos items do pedido
            const items = orderDetails.orderItems.map((item) => {
                // Pegar informações do produto (pode estar em product ou storeProduct)
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

            // Determinar o status baseado no status do pagamento Mercado Pago e Banco de Dados
            let orderStatus = 'pending';
            if (paymentInfo.status === 'approved') {
                if (orderDetails.status === 'OPENED') {
                    orderStatus = 'approved';
                } else if (orderDetails.status === 'IN_PROGRESS') {
                    orderStatus = 'in_progress';
                } else if (orderDetails.status === 'IN_DELIVERY') {
                    orderStatus = 'in_delivery';
                } else if (orderDetails.status === 'DONE') {
                    orderStatus = 'done';
                }
            } else if (paymentInfo.status === 'rejected' || paymentInfo.status === 'cancelled') {
                orderStatus = 'failure';
            }

            // Montar resposta completa
            return {
                // 1. Informações básicas do pedido
                order: {
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

                // 5. Informações de pagamento
                payment: {
                    id: String(paymentInfo.id),
                    method_id: paymentInfo.payment_method_id,
                    method_type: paymentInfo.payment_type_id,
                    payment_brand: paymentInfo.payment_method_id, // Ex: 'pix', 'visa', 'master'
                    status: paymentInfo.status, // 'approved', 'pending', 'rejected'
                    status_detail: paymentInfo.status_detail,
                    transaction_amount: orderDetails.total,
                    currency_id: paymentInfo.currency_id,
                    date_approved: paymentInfo.date_approved,
                    date_created: paymentInfo.date_created,
                    payer: paymentInfo.payer ? {
                        email: paymentInfo.payer.email,
                        first_name: paymentInfo.payer.first_name,
                        last_name: paymentInfo.payer.last_name,
                    } : null,
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

                // Informações do cliente
                client: {
                    first_name: orderDetails.client.first_name,
                    last_name: orderDetails.client.last_name,
                    phone_number: orderDetails.client.phone_number,
                    email: orderDetails.client.email,
                },

                // Informações da loja (se houver)
                store: orderDetails.store ? {
                    name: orderDetails.store.name,
                    slug: orderDetails.store.slug,
                    phone_number: orderDetails.store.phone_number,
                    email: orderDetails.store.email,
                } : null,
            };

        } catch (error: any) {
            console.error("[GetMercadoPagoPaymentStatusService] Failed:", error);

            if (error instanceof BadRequestException) {
                throw error;
            }

            throw new BadRequestException(
                error.message || "Failed to get payment status",
                ErrorCodes.SYSTEM_ERROR
            );
        }
    }
}

export { GetMercadoPagoPaymentStatusService };
