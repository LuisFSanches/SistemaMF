import { MercadoPagoConfig, Payment } from 'mercadopago';
import { IMercadoPagoPaymentNotification } from "../../interfaces/IMercadoPago";
import prismaClient from "../../prisma";
import { ErrorCodes } from "../../exceptions/root";
import { BadRequestException } from "../../exceptions/bad-request";
import { orderEmitter, OrderEvents } from "../../events/orderEvents";
import { SendWhatsAppMessageService } from "../whatsapp/SendWhatsAppMessageService";

class ProcessMercadoPagoWebhookService {
    async execute(data: IMercadoPagoPaymentNotification, store_slug?: string) {
        const { type, action, data: notificationData } = data;

        // Apenas processar notificações de pagamento
        if (type !== 'payment') {
            console.log(`[ProcessMercadoPagoWebhookService] Ignoring notification type: ${type}`);
            return { success: true, message: 'Notification type ignored' };
        }

        const paymentId = notificationData.id;

        if (!paymentId) {
            throw new BadRequestException(
                "Payment ID not provided",
                ErrorCodes.BAD_REQUEST
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
            const paymentInfo = await payment.get({ id: paymentId });

            if (!paymentInfo) {
                throw new BadRequestException(
                    "Payment not found in Mercado Pago",
                    ErrorCodes.BAD_REQUEST
                );
            }

            const orderId = paymentInfo.external_reference;

            if (!orderId) {
                return { success: true, message: 'Payment has no external reference' };
            }

            // Buscar pedido no banco pelo ID
            const order = await prismaClient.order.findUnique({
                where: { id: orderId }
            });

            if (!order) {
                return { success: true, message: 'Order not found' };
            }

            // Mapear status do Mercado Pago para status do pedido
            const paymentStatus = paymentInfo.status;
            let paymentReceived = false;
            let orderStatus = order.status;
            let paymentMethod = order.payment_method;

            switch (paymentStatus) {
                case 'approved':
                    paymentReceived = true;
                    orderStatus = 'OPENED';
                    paymentMethod = `MercadoPago - ${paymentInfo.payment_type_id}`;
                    break;
                case 'pending':
                case 'in_process':
                    paymentReceived = false;
                    paymentMethod = `MercadoPago - ${paymentInfo.payment_type_id} (Pendente)`;
                    break;
                case 'rejected':
                case 'cancelled':
                    paymentReceived = false;
                    paymentMethod = `MercadoPago - ${paymentInfo.payment_type_id} (Rejeitado)`;
                    break;
                case 'refunded':
                    paymentReceived = false;
                    paymentMethod = `MercadoPago - ${paymentInfo.payment_type_id} (Reembolsado)`;
                    break;
                default:
                    console.log(`[ProcessMercadoPagoWebhookService] Unknown payment status: ${paymentStatus}`);
            }

            // Atualizar pedido
            const updatedOrder = await prismaClient.order.update({
                where: { id: orderId },
                data: {
                    payment_received: paymentReceived,
                    payment_method: paymentMethod,
                    status: orderStatus,
                    updated_at: new Date(),
                },
                include: {
                    client: true,
                    clientAddress: true,
                    store: true,
                    orderItems: {
                        include: {
                            product: true
                        }
                    }
                }
            });

            // Emitir evento se pagamento foi aprovado e mudou de PENDING_PAYMENT para OPENED
            if (paymentStatus === 'approved' && order.status === 'PENDING_PAYMENT' && orderStatus === 'OPENED') {
                try {
                    const sendWhatsAppService = new SendWhatsAppMessageService();
                    const customerName = `${updatedOrder.client.first_name} ${updatedOrder.client.last_name}`;
                    const storeName = updatedOrder.store?.name || 'Nossa Loja';

                    await sendWhatsAppService.execute({
                        phone_number: updatedOrder.client.phone_number,
                        customer_name: customerName,
                        order_number: updatedOrder.code.toString(),
                        store_name: storeName
                    });

                } catch (whatsappError: any) {}

                orderEmitter.emit(OrderEvents.OrderPaymentConfirmed, {
                    order: updatedOrder,
                    store_id: order.store_id,
                    payment_info: {
                        payment_id: paymentInfo.id,
                        payment_type: paymentInfo.payment_type_id,
                        amount: paymentInfo.transaction_amount,
                    }
                });
            }

            return {
                success: true,
                message: 'Payment processed successfully',
                order_id: orderId,
                order_code: order.code,
                payment_status: paymentStatus,
                payment_received: paymentReceived,
            };

        } catch (error: any) {
            console.error("[ProcessMercadoPagoWebhookService] Failed:", error);

            if (error instanceof BadRequestException) {
                throw error;
            }

            throw new BadRequestException(
                error.message || "Failed to process webhook",
                ErrorCodes.SYSTEM_ERROR
            );
        }
    }
}

export { ProcessMercadoPagoWebhookService };
