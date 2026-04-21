import prismaClient from "../../prisma";
import { ErrorCodes } from "../../exceptions/root";
import { BadRequestException } from "../../exceptions/bad-request";
import { orderEmitter, OrderEvents } from "../../events/orderEvents";
import { SendWhatsAppMessageService } from "../whatsapp/SendWhatsAppMessageService";
import { UpdateStoreProductStockService } from "../storeProduct/UpdateStoreProductStockService";

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
            const order = await this.fetchOrder(order_id);
            this.logTestInfo(order_id, order.status, payment_status);

            const { paymentReceived, orderStatus, paymentMethod } = this.mapPaymentStatus(
                payment_status,
                payment_type,
                order
            );

            const updatedOrder = await this.updateOrder(
                order_id,
                paymentReceived,
                paymentMethod,
                orderStatus
            );

            const eventEmitted = await this.handlePaymentConfirmation(
                payment_status,
                order,
                orderStatus,
                updatedOrder,
                payment_type,
                payment_amount
            );

            return this.buildResponse(
                order_id,
                order.status,
                orderStatus,
                payment_status,
                paymentReceived,
                eventEmitted,
                updatedOrder
            );

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

    private async fetchOrder(order_id: string) {
        const order = await prismaClient.order.findUnique({
            where: { id: order_id }
        });

        if (!order) {
            throw new BadRequestException(
                `Order ${order_id} not found`,
                ErrorCodes.BAD_REQUEST
            );
        }

        return order;
    }

    private logTestInfo(order_id: string, currentStatus: string, payment_status: string) {
        console.log(`[TestMercadoPagoWebhookService] Testing payment for order ${order_id}`);
        console.log(`[TestMercadoPagoWebhookService] Current status: ${currentStatus}`);
        console.log(`[TestMercadoPagoWebhookService] Payment status to apply: ${payment_status}`);
    }

    private mapPaymentStatus(payment_status: string, payment_type: string, order: any) {
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

        return { paymentReceived, orderStatus, paymentMethod };
    }

    private async updateOrder(order_id: string, paymentReceived: boolean, paymentMethod: string, orderStatus: string) {
        return prismaClient.order.update({
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
    }

    private async handlePaymentConfirmation(
        payment_status: string,
        order: any,
        orderStatus: string,
        updatedOrder: any,
        payment_type: string,
        payment_amount?: number
    ): Promise<boolean> {
        const shouldProcess = payment_status === 'approved' && 
                             order.status === 'PENDING_PAYMENT' && 
                             orderStatus === 'OPENED';

        if (shouldProcess) {
            await this.sendWhatsAppNotification(updatedOrder);
            await this.updateStock(updatedOrder);
            this.emitPaymentEvent(updatedOrder, order.store_id, payment_type, payment_amount || order.total);
        }

        return shouldProcess;
    }

    private async sendWhatsAppNotification(updatedOrder: any) {
        try {
            // Comentado para testes, mas mantendo a estrutura
            //const sendWhatsAppService = new SendWhatsAppMessageService();
            //const customerName = `${updatedOrder.client.first_name} ${updatedOrder.client.last_name}`;
            //const storeName = 'Loja Teste';

            /*await sendWhatsAppService.execute({
                phone_number: updatedOrder.client.phone_number,
                customer_name: customerName,
                order_number: updatedOrder.code.toString(),
                store_name: storeName,
                store_phone_number: updatedOrder.store?.phone_number || '',
                order_id: updatedOrder.id,
                store_slug: updatedOrder.store?.slug || 'loja'
            });*/
        } catch (whatsappError: any) {
            console.log(`[TestMercadoPagoWebhookService] WhatsApp error:`, whatsappError);
        }
    }

    private async updateStock(updatedOrder: any) {
        try {
            const updateStockService = new UpdateStoreProductStockService();
            const stockResult = await updateStockService.execute({ order_id: updatedOrder.id });
            console.log(
                `[TestMercadoPagoWebhookService] Stock updated for order ${updatedOrder.code}: ` +
                `${stockResult.updated_products_count} products updated`
            );
        } catch (stockError: any) {
            console.error(`[TestMercadoPagoWebhookService] Failed to update stock:`, stockError.message);
        }
    }

    private emitPaymentEvent(updatedOrder: any, store_id: string, payment_type: string, payment_amount: number) {
        orderEmitter.emit(OrderEvents.OrderPaymentConfirmed, {
            order: updatedOrder,
            store_id: store_id,
            payment_info: {
                payment_id: 123456789,
                payment_type: payment_type,
                amount: payment_amount,
            }
        });
    }

    private buildResponse(
        order_id: string,
        previous_status: string,
        new_status: string,
        payment_status: string,
        payment_received: boolean,
        event_emitted: boolean,
        updatedOrder: any
    ) {
        return {
            success: true,
            message: 'Test payment processed successfully',
            order_id: order_id,
            previous_status: previous_status,
            new_status: new_status,
            payment_status: payment_status,
            payment_received: payment_received,
            event_emitted: event_emitted,
            order: updatedOrder
        };
    }
}

export { TestMercadoPagoWebhookService };
