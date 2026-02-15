import axios from 'axios';
import { BadRequestException } from "../../exceptions/bad-request";
import { ErrorCodes } from "../../exceptions/root";

interface IWhatsAppTemplateMessage {
    phone_number: string
    template_name: string
    language_code: string
    parameters: string[]
}

interface IWhatsAppTemplateResponse {
    success: boolean
    message_id?: string
    error?: string
}

/**
 * Service para enviar mensagens usando templates aprovados pelo WhatsApp.
 * Templates devem ser criados e aprovados no WhatsApp Business Manager antes de usar.
 * 
 * @example
 * // Template criado no painel:
 * // Nome: order_confirmation
 * // Conteúdo: "Olá {{1}}! Seu pedido #{{2}} foi confirmado! Total: R$ {{3}}"
 * 
 * const service = new SendWhatsAppTemplateService();
 * await service.execute({
 *   phone_number: "5511999999999",
 *   template_name: "order_confirmation",
 *   language_code: "pt_BR",
 *   parameters: ["João Silva", "1234", "150.00"]
 * });
 */
class SendWhatsAppTemplateService {
    async execute(data: IWhatsAppTemplateMessage): Promise<IWhatsAppTemplateResponse> {
        // Validar variáveis de ambiente
        const whatsappAccessToken = process.env.WHATSAPP_ACCESS_TOKEN;
        const whatsappPhoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
        const whatsappApiVersion = process.env.WHATSAPP_API_VERSION || 'v18.0';

        if (!whatsappAccessToken || !whatsappPhoneNumberId) {
            console.error("[SendWhatsAppTemplateService] WhatsApp Business API credentials not configured");
            throw new BadRequestException(
                "WhatsApp Business API not configured",
                ErrorCodes.SYSTEM_ERROR
            );
        }

        try {
            // Formatar número de telefone
            const cleanPhone = data.phone_number.replace(/\D/g, '');

            // Preparar componentes do template
            const components = [];

            // Adicionar parâmetros ao componente body (se houver)
            if (data.parameters && data.parameters.length > 0) {
                components.push({
                    type: "body",
                    parameters: data.parameters.map(param => ({
                        type: "text",
                        text: param
                    }))
                });
            }

            // Preparar payload para WhatsApp Business API
            const payload = {
                messaging_product: 'whatsapp',
                recipient_type: 'individual',
                to: cleanPhone,
                type: 'template',
                template: {
                    name: data.template_name,
                    language: {
                        code: data.language_code
                    },
                    components: components.length > 0 ? components : undefined
                }
            };

            // Enviar mensagem via WhatsApp Business API oficial
            const response = await axios.post(
                `https://graph.facebook.com/${whatsappApiVersion}/${whatsappPhoneNumberId}/messages`,
                payload,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${whatsappAccessToken}`
                    },
                    timeout: 30000
                }
            );

            console.log(`[SendWhatsAppTemplateService] Template message sent to ${cleanPhone}:`, {
                template: data.template_name,
                message_id: response.data?.messages?.[0]?.id
            });

            return {
                success: true,
                message_id: response.data?.messages?.[0]?.id || 'sent'
            };

        } catch (error: any) {
            const errorMessage = error.response?.data?.error?.message || error.message;
            const errorCode = error.response?.data?.error?.code;
            
            console.error("[SendWhatsAppTemplateService] Failed to send template message:", {
                error: errorMessage,
                code: errorCode,
                template: data.template_name,
                phone: data.phone_number
            });
            
            return {
                success: false,
                error: errorMessage
            };
        }
    }
}

export { SendWhatsAppTemplateService };
export type { IWhatsAppTemplateMessage, IWhatsAppTemplateResponse };
