import { MercadoPagoConfig, Payment } from 'mercadopago';
import { IMercadoPagoPaymentNotification } from "../../interfaces/IMercadoPago";
import prismaClient from "../../prisma";
import { ErrorCodes } from "../../exceptions/root";
import { BadRequestException } from "../../exceptions/bad-request";
import { orderEmitter, OrderEvents } from "../../events/orderEvents";

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
            console.log(`[ProcessMercadoPagoWebhookService] Fetching payment ${paymentId} from Mercado Pago...`);
            const paymentInfo = await payment.get({ id: paymentId });

            if (!paymentInfo) {
                throw new BadRequestException(
                    "Payment not found in Mercado Pago",
                    ErrorCodes.BAD_REQUEST
                );
            }

            console.log(`[ProcessMercadoPagoWebhookService] Payment info:`, {
                id: paymentInfo.id,
                status: paymentInfo.status,
                status_detail: paymentInfo.status_detail,
                payment_type_id: paymentInfo.payment_type_id,
                external_reference: paymentInfo.external_reference,
            });

            const orderId = paymentInfo.external_reference;

            if (!orderId) {
                console.log(`[ProcessMercadoPagoWebhookService] Payment ${paymentId} has no external reference`);
                return { success: true, message: 'Payment has no external reference' };
            }

            // Buscar pedido no banco
            const order = await prismaClient.order.findUnique({
                where: { id: orderId }
            });

            if (!order) {
                console.log(`[ProcessMercadoPagoWebhookService] Order ${orderId} not found`);
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
                    orderItems: {
                        include: {
                            product: true
                        }
                    }
                }
            });

            console.log(`[ProcessMercadoPagoWebhookService] Order ${orderId} updated - Payment: ${paymentStatus}, Received: ${paymentReceived}`);

            // Emitir evento se pagamento foi aprovado e mudou de PENDING_PAYMENT para OPENED
            if (paymentStatus === 'approved' && order.status === 'PENDING_PAYMENT' && orderStatus === 'OPENED') {
                console.log(`[ProcessMercadoPagoWebhookService] Emitting OrderPaymentConfirmed event for order ${orderId}`);
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
