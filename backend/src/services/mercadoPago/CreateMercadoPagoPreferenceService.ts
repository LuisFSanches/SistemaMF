import { MercadoPagoConfig, Preference } from 'mercadopago';
import { ICreatePreference, IMercadoPagoPreferenceResponse } from "../../interfaces/IMercadoPago";
import prismaClient from "../../prisma";
import { ErrorCodes } from "../../exceptions/root";
import { BadRequestException } from "../../exceptions/bad-request";
import { createPreferenceSchema } from "../../schemas/mercadoPago/createPreference";

class CreateMercadoPagoPreferenceService {
    async execute(data: ICreatePreference): Promise<IMercadoPagoPreferenceResponse> {
        // 1. Validação com Zod
        const parsed = createPreferenceSchema.safeParse(data);

        if (!parsed.success) {
            throw new BadRequestException(
                parsed.error.errors[0].message,
                ErrorCodes.VALIDATION_ERROR
            );
        }

        console.log("[CreateMercadoPagoPreferenceService] Validation succeeded:", parsed.data);

        const { order_id, store_slug, items, payer, back_urls, shipments } = parsed.data;

        // 2. Verificar se o pedido existe
        const order = await prismaClient.order.findUnique({
            where: { id: order_id },
            include: {
                client: true,
                store: true,
            }
        });

        if (!order) {
            throw new BadRequestException(
                "Order not found",
                ErrorCodes.BAD_REQUEST
            );
        }

        // 3. Verificar se a loja existe e tem credenciais do Mercado Pago
        const store = await prismaClient.store.findUnique({
            where: { slug: store_slug }
        });

        if (!store) {
            throw new BadRequestException(
                "Store not found",
                ErrorCodes.BAD_REQUEST
            );
        }

        // Usar credenciais da loja se disponíveis, senão usar as globais
        const accessToken = store.mp_access_token || process.env.MP_ACCESS_TOKEN;

        if (!accessToken) {
            throw new BadRequestException(
                "Mercado Pago credentials not configured",
                ErrorCodes.BAD_REQUEST
            );
        }

        try {
            // 4. Configurar cliente Mercado Pago
            const client = new MercadoPagoConfig({ 
                accessToken: accessToken,
                options: { timeout: 5000 }
            });

            const preference = new Preference(client);

            // 5. Montar URL base para notificações
            const baseUrl = process.env.API_BASE_URL || 'https://api.exemplo.com';
            const notificationUrl = `${baseUrl}/webhook/mercadopago`;

            // 6. Montar back_urls (URLs de retorno)
            const frontendUrl = process.env.FRONTEND_URL || 'https://loja.exemplo.com';
            const successUrl = back_urls?.success || `${frontendUrl}/${store_slug}/checkout/success`;
            const failureUrl = back_urls?.failure || `${frontendUrl}/${store_slug}/checkout/failure`;
            const pendingUrl = back_urls?.pending || `${frontendUrl}/${store_slug}/checkout/pending`;

            console.log('[CreateMercadoPagoPreferenceService] Back URLs:', { successUrl, failureUrl, pendingUrl });

            // Verificar se está em ambiente de desenvolvimento (localhost)
            const isLocalhost = successUrl.includes('localhost') || successUrl.includes('127.0.0.1');

            // 7. Criar preferência de pagamento
            const preferenceData: any = {
                items: items.map(item => ({
                    id: item.id,
                    title: item.title,
                    description: item.description || '',
                    picture_url: item.picture_url || '',
                    quantity: item.quantity,
                    unit_price: item.unit_price,
                    currency_id: item.currency_id || 'BRL',
                })),
                external_reference: order_id,
                notification_url: notificationUrl,
                back_urls: {
                    success: successUrl,
                    failure: failureUrl,
                    pending: pendingUrl,
                },
                statement_descriptor: store.name.substring(0, 22), // Max 22 caracteres
            };

            // auto_return só funciona com URLs públicas (não localhost)
            if (!isLocalhost) {
                preferenceData.auto_return = 'approved';
            }

            // Adicionar payer se fornecido
            if (payer) {
                preferenceData.payer = {
                    name: payer.name || '',
                    surname: payer.surname || '',
                    email: payer.email || '',
                };
                
                if (payer.phone?.area_code && payer.phone?.number) {
                    preferenceData.payer.phone = {
                        area_code: payer.phone.area_code,
                        number: payer.phone.number,
                    };
                }
            }

            // Adicionar shipments (frete) se fornecido
            if (shipments && shipments.cost > 0) {
                preferenceData.shipments = {
                    cost: shipments.cost,
                    mode: shipments.mode || 'not_specified',
                };
            }

            // Definir PIX como método de pagamento padrão
            preferenceData.payment_methods = {
                default_payment_method_id: 'pix',
                excluded_payment_methods: [],
                excluded_payment_types: [],
            };

            const response = await preference.create({ body: preferenceData });

            if (!response.id || !response.init_point) {
                throw new BadRequestException(
                    "Failed to create Mercado Pago preference",
                    ErrorCodes.SYSTEM_ERROR
                );
            }

            console.log(`[CreateMercadoPagoPreferenceService] Preference created: ${response.id} for order: ${order_id}`);

            return {
                id: response.id,
                init_point: response.init_point,
                sandbox_init_point: response.sandbox_init_point || response.init_point,
            };

        } catch (error: any) {
            console.error("[CreateMercadoPagoPreferenceService] Failed:", error);

            if (error instanceof BadRequestException) {
                throw error;
            }

            throw new BadRequestException(
                error.message || "Failed to create payment preference",
                ErrorCodes.SYSTEM_ERROR
            );
        }
    }
}

export { CreateMercadoPagoPreferenceService };
