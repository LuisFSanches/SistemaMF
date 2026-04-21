import { MercadoPagoConfig, Payment } from 'mercadopago';
import { IMercadoPagoPaymentNotification } from "../../interfaces/IMercadoPago";
import prismaClient from "../../prisma";
import { ErrorCodes } from "../../exceptions/root";
import { BadRequestException } from "../../exceptions/bad-request";
import { orderEmitter, OrderEvents } from "../../events/orderEvents";
import { SendWhatsAppMessageService } from "../whatsapp/SendWhatsAppMessageService";
import { UpdateStoreProductStockService } from "../storeProduct/UpdateStoreProductStockService";

class ProcessMercadoPagoWebhookService {
    async execute(data: IMercadoPagoPaymentNotification, store_slug?: string) {
        const { type, data: notificationData } = data;

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
            const paymentInfo = await this.fetchPaymentInfo(paymentId, store_slug);
            const orderId = paymentInfo.external_reference;

            if (!orderId) {
                return { success: true, message: 'Payment has no external reference' };
            }

            const order = await this.fetchOrder(orderId);

            if (!order) {
                return { success: true, message: 'Order not found' };
            }

            const { paymentReceived, orderStatus, paymentMethod } = this.mapPaymentStatus(
                paymentInfo.status,
                paymentInfo.payment_type_id,
                order
            );

            const updatedOrder = await this.updateOrder(
                orderId,
                paymentReceived,
                paymentMethod,
                orderStatus
            );

            await this.handlePaymentConfirmation(
                paymentInfo.status,
                order,
                orderStatus,
                updatedOrder,
                paymentInfo
            );

            return {
                success: true,
                message: 'Payment processed successfully',
                order_id: orderId,
                order_code: order.code,
                payment_status: paymentInfo.status,
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

    private async getAccessToken(store_slug?: string): Promise<string> {
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

        return accessToken;
    }

    private async fetchPaymentInfo(paymentId: string, store_slug?: string) {
        const accessToken = await this.getAccessToken(store_slug);

        const client = new MercadoPagoConfig({ 
            accessToken: accessToken,
            options: { timeout: 5000 }
        });

        const payment = new Payment(client);
        const paymentInfo = await payment.get({ id: paymentId });

        if (!paymentInfo) {
            throw new BadRequestException(
                "Payment not found in Mercado Pago",
                ErrorCodes.BAD_REQUEST
            );
        }

        return paymentInfo;
    }

    private async fetchOrder(orderId: string) {
        return prismaClient.order.findUnique({
            where: { id: orderId }
        });
    }

    private mapPaymentStatus(paymentStatus: string | undefined, paymentTypeId: string | undefined, order: any) {
        let paymentReceived = false;
        let orderStatus = order.status;
        let paymentMethod = order.payment_method;

        switch (paymentStatus) {
            case 'approved':
                paymentReceived = true;
                orderStatus = 'OPENED';
                paymentMethod = `MercadoPago - ${paymentTypeId}`;
                break;
            case 'pending':
            case 'in_process':
                paymentReceived = false;
                paymentMethod = `MercadoPago - ${paymentTypeId} (Pendente)`;
                break;
            case 'rejected':
            case 'cancelled':
                paymentReceived = false;
                paymentMethod = `MercadoPago - ${paymentTypeId} (Rejeitado)`;
                break;
            case 'refunded':
                paymentReceived = false;
                paymentMethod = `MercadoPago - ${paymentTypeId} (Reembolsado)`;
                break;
            default:
                console.log(`[ProcessMercadoPagoWebhookService] Unknown payment status: ${paymentStatus}`);
        }

        return { paymentReceived, orderStatus, paymentMethod };
    }

    private async updateOrder(orderId: string, paymentReceived: boolean, paymentMethod: string, orderStatus: string) {
        return prismaClient.order.update({
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
    }

    private async handlePaymentConfirmation(
        paymentStatus: string | undefined,
        order: any,
        orderStatus: string,
        updatedOrder: any,
        paymentInfo: any
    ) {
        if (paymentStatus === 'approved' && order.status === 'PENDING_PAYMENT' && orderStatus === 'OPENED') {
            await this.sendWhatsAppNotification(updatedOrder);
            await this.updateStock(updatedOrder);
            this.emitPaymentEvent(updatedOrder, order.store_id, paymentInfo);
        }
    }

    private async sendWhatsAppNotification(updatedOrder: any) {
        try {
            const sendWhatsAppService = new SendWhatsAppMessageService();
            const customerName = `${updatedOrder.client.first_name} ${updatedOrder.client.last_name}`;
            const storeName = updatedOrder.store?.name || 'Nossa Loja';

            await sendWhatsAppService.execute({
                phone_number: updatedOrder.client.phone_number,
                customer_name: customerName,
                order_number: updatedOrder.code.toString(),
                store_name: storeName,
                store_phone_number: updatedOrder.store?.phone_number || '',
                order_id: updatedOrder.id,
                store_slug: updatedOrder.store?.slug || 'loja'
            });
        } catch (whatsappError: any) {
            console.error(`[ProcessMercadoPagoWebhookService] WhatsApp error:`, whatsappError.message);
        }
    }

    private async updateStock(updatedOrder: any) {
        try {
            const updateStockService = new UpdateStoreProductStockService();
            const stockResult = await updateStockService.execute({ order_id: updatedOrder.id });
            console.log(
                `[ProcessMercadoPagoWebhookService] Stock updated for order ${updatedOrder.code}: ` +
                `${stockResult.updated_products_count} products updated`
            );
        } catch (stockError: any) {
            console.error(`[ProcessMercadoPagoWebhookService] Failed to update stock:`, stockError.message);
        }
    }

    private emitPaymentEvent(updatedOrder: any, store_id: string, paymentInfo: any) {
        orderEmitter.emit(OrderEvents.OrderPaymentConfirmed, {
            order: updatedOrder,
            store_id: store_id,
            payment_info: {
                payment_id: paymentInfo.id,
                payment_type: paymentInfo.payment_type_id,
                amount: paymentInfo.transaction_amount,
            }
        });
    }
}

export { ProcessMercadoPagoWebhookService };
