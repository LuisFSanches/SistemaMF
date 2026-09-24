import axios from 'axios';
import { getCountryCallingCode, CountryCode } from 'libphonenumber-js';
import { IWhatsAppResponse } from "../../interfaces/IWhatsAppMessage";

class SendVerificationCodeWhatsAppService {
    async execute(phoneNumber: string, code: string, countryCode: string = 'BR'): Promise<IWhatsAppResponse> {
        const whatsappAccessToken = process.env.WHATSAPP_ACCESS_TOKEN;
        const whatsappPhoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
        const whatsappApiVersion = process.env.WHATSAPP_API_VERSION || 'v22.0';

        if (!whatsappAccessToken || !whatsappPhoneNumberId) {
            console.error("[SendVerificationCodeWhatsAppService] WhatsApp Business API credentials not configured");
            return {
                success: false,
                error: "WhatsApp Business API not configured"
            };
        }

        try {
            const cleanPhone = phoneNumber.replace(/\D/g, '');
            const callingCode = getCountryCallingCode((countryCode || 'BR') as CountryCode);
            const phoneWithCountryCode = cleanPhone.startsWith(callingCode)
                ? cleanPhone
                : `${callingCode}${cleanPhone}`;

            const payload = {
                messaging_product: 'whatsapp',
                to: phoneWithCountryCode,
                type: 'template',
                template: {
                    name: 'codigo_verificacao',
                    language: {
                        code: 'pt_BR'
                    },
                    components: [
                        {
                            type: 'body',
                            parameters: [
                                {
                                    type: 'text',
                                    text: code
                                }
                            ]
                        },
                        {
                            type: 'button',
                            sub_type: 'url',
                            index: 0,
                            parameters: [
                                {
                                    type: 'text',
                                    text: code
                                }
                            ]
                        }
                    ]
                }
            };

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

            return {
                success: true,
                message_id: response.data?.messages?.[0]?.id || 'sent'
            };

        } catch (error: any) {
            const errorMessage = error.response?.data?.error?.message || error.message;
            const errorCode = error.response?.data?.error?.code;

            console.error("[SendVerificationCodeWhatsAppService] Failed to send message:", {
                error: errorMessage,
                code: errorCode,
                phone: phoneNumber
            });

            return {
                success: false,
                error: errorMessage
            };
        }
    }
}

export { SendVerificationCodeWhatsAppService };
