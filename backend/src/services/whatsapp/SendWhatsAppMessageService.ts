import axios from 'axios';
import { IWhatsAppMessage, IWhatsAppResponse } from "../../interfaces/IWhatsAppMessage";
import { sendWhatsAppMessageSchema } from "../../schemas/whatsapp/sendWhatsAppMessage";
import { BadRequestException } from "../../exceptions/bad-request";
import { ErrorCodes } from "../../exceptions/root";

class SendWhatsAppMessageService {
    async execute(data: IWhatsAppMessage): Promise<IWhatsAppResponse> {
        // 1. Validação com Zod
        const parsed = sendWhatsAppMessageSchema.safeParse(data);

        if (!parsed.success) {
            throw new BadRequestException(
                parsed.error.errors[0].message,
                ErrorCodes.VALIDATION_ERROR
            );
        }

        const whatsappAccessToken = process.env.WHATSAPP_ACCESS_TOKEN;
        const whatsappPhoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
        const whatsappApiVersion = process.env.WHATSAPP_API_VERSION || 'v22.0';

        if (!whatsappAccessToken || !whatsappPhoneNumberId) {
            console.error("[SendWhatsAppMessageService] WhatsApp Business API credentials not configured");
            throw new BadRequestException(
                "WhatsApp Business API not configured",
                ErrorCodes.SYSTEM_ERROR
            );
        }

        try {
            const cleanPhone = data.phone_number.replace(/\D/g, '');
            const phoneWithCountryCode = cleanPhone.startsWith('55') ? cleanPhone : `55${cleanPhone}`;

            const payload: any = {
                messaging_product: 'whatsapp',
                to: phoneWithCountryCode,
                type: 'template',
                template: {
                    name: 'pedido_recebido',
                    language: {
                        code: 'pt_BR'
                    },
                    components: [
                        {
                            type: 'body',
                            parameters: [
                                {
                                    type: 'text',
                                    text: data.customer_name || 'Cliente'
                                },
                                {
                                    type: 'text',
                                    text: data.order_number || 'N/A'
                                },
                                {
                                    type: 'text',
                                    text: data.store_name || 'Nossa Loja'
                                }
                            ]
                        }
                    ]
                }
            };
            
            // 5. Enviar mensagem via WhatsApp Business API oficial
            const response = await axios.post(
                `https://graph.facebook.com/${whatsappApiVersion}/${whatsappPhoneNumberId}/messages`,
                payload,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${whatsappAccessToken}`
                    },
                    timeout: 30000 // 30 segundos
                }
            );

            return {
                success: true,
                message_id: response.data?.messages?.[0]?.id || 'sent'
            };

        } catch (error: any) {
            const errorMessage = error.response?.data?.error?.message || error.message;
            const errorCode = error.response?.data?.error?.code;
            
            console.error("[SendWhatsAppMessageService] Failed to send message:", {
                error: errorMessage,
                code: errorCode,
                phone: data.phone_number
            });
            
            return {
                success: false,
                error: errorMessage
            };
        }
    }
}

export { SendWhatsAppMessageService };
