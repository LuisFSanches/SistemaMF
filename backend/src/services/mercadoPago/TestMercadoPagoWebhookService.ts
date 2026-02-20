import prismaClient from "../../prisma";
import { ErrorCodes } from "../../exceptions/root";
import { BadRequestException } from "../../exceptions/bad-request";
import { orderEmitter, OrderEvents } from "../../events/orderEvents";
import { SendWhatsAppMessageService } from "../whatsapp/SendWhatsAppMessageService";

interface ITestWebhookData {
    order_id: string;
    payment_status?: 'approved' | 'pending' | 'in_process' | 'rejected' | 'cancelled' | 'refunded';
    payment_type?: string;
    payment_amount?: number;
}

class TestMercadoPagoWebhookService {
    async execute(data: ITestWebhookData) {
        const { 
            order_id, 
            payment_status = 'approved', 
            payment_type = 'pix',
            payment_amount 
        } = data;

        if (!order_id) {
            throw new BadRequestException(
                "Order ID is required",
                ErrorCodes.BAD_REQUEST
            );
        }

        try {
            // Buscar pedido no banco
            const order = await prismaClient.order.findUnique({
                where: { id: order_id }
            });

            if (!order) {
                throw new BadRequestException(
                    `Order ${order_id} not found`,
                    ErrorCodes.BAD_REQUEST
                );
            }

            console.log(`[TestMercadoPagoWebhookService] Testing payment for order ${order_id}`);
            console.log(`[TestMercadoPagoWebhookService] Current status: ${order.status}`);
            console.log(`[TestMercadoPagoWebhookService] Payment status to apply: ${payment_status}`);

            // Mapear status do Mercado Pago para status do pedido
            let paymentReceived = false;
            let orderStatus = order.status;
            let paymentMethod = order.payment_method;

            switch (payment_status) {
                case 'approved':
                    paymentReceived = true;
                    orderStatus = 'OPENED';
                    paymentMethod = `MercadoPago - ${payment_type}`;
                    break;
                case 'pending':
                case 'in_process':
                    paymentReceived = false;
                    paymentMethod = `MercadoPago - ${payment_type} (Pendente)`;
                    break;
                case 'rejected':
                case 'cancelled':
                    paymentReceived = false;
                    paymentMethod = `MercadoPago - ${payment_type} (Rejeitado)`;
                    break;
                case 'refunded':
                    paymentReceived = false;
                    paymentMethod = `MercadoPago - ${payment_type} (Reembolsado)`;
                    break;
                default:
                    console.log(`[TestMercadoPagoWebhookService] Unknown payment status: ${payment_status}`);
            }

            // Atualizar pedido
            const updatedOrder = await prismaClient.order.update({
                where: { id: order_id },
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

            if (payment_status === 'approved' && order.status === 'PENDING_PAYMENT' && orderStatus === 'OPENED') {
                try {
                    const sendWhatsAppService = new SendWhatsAppMessageService();
                    const customerName = `${updatedOrder.client.first_name} ${updatedOrder.client.last_name}`;
                    const storeName = 'Loja Teste';

                    await sendWhatsAppService.execute({
                        phone_number: updatedOrder.client.phone_number,
                        customer_name: customerName,
                        order_number: updatedOrder.code.toString(),
                        store_name: storeName
                    });

                } catch (whatsappError: any) {
                    console.log(`[TestMercadoPagoWebhookService] Failed to send WhatsApp message for order ${order_id}:`, whatsappError);
                }

                orderEmitter.emit(OrderEvents.OrderPaymentConfirmed, {
                    order: updatedOrder,
                    store_id: order.store_id,
                    payment_info: {
                        payment_id: 123456789,
                        payment_type: payment_type,
                        amount: payment_amount || order.total,
                    }
                });
            }

            return {
                success: true,
                message: 'Test payment processed successfully',
                order_id: order_id,
                previous_status: order.status,
                new_status: orderStatus,
                payment_status: payment_status,
                payment_received: paymentReceived,
                event_emitted: payment_status === 'approved' && order.status === 'PENDING_PAYMENT' && orderStatus === 'OPENED',
                order: updatedOrder
            };

        } catch (error: any) {
            console.error("[TestMercadoPagoWebhookService] Failed:", error);

            if (error instanceof BadRequestException) {
                throw error;
            }

            throw new BadRequestException(
                error.message || "Failed to process test webhook",
                ErrorCodes.SYSTEM_ERROR
            );
        }
    }
}

export { TestMercadoPagoWebhookService };
