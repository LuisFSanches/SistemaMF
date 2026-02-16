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

            // Buscar informações do pedido no banco
            let orderCode = null;
            let orderTotal = null;

            if (paymentInfo.external_reference) {
                const order = await prismaClient.order.findUnique({
                    where: { id: paymentInfo.external_reference },
                    select: { 
                        code: true,
                        total: true,
                    }
                });
                
                if (order) {
                    orderCode = order.code;
                    orderTotal = order.total;
                }
            }

            return {
                id: paymentInfo.id,
                status: paymentInfo.status,
                status_detail: paymentInfo.status_detail,
                external_reference: paymentInfo.external_reference,
                order_code: orderCode,
                transaction_amount: orderTotal || paymentInfo.transaction_amount, // Usar total do pedido
                currency_id: paymentInfo.currency_id,
                payment_method_id: paymentInfo.payment_method_id,
                payment_type_id: paymentInfo.payment_type_id,
                date_approved: paymentInfo.date_approved,
                date_created: paymentInfo.date_created,
                payer: paymentInfo.payer ? {
                    email: paymentInfo.payer.email,
                    first_name: paymentInfo.payer.first_name,
                    last_name: paymentInfo.payer.last_name,
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
