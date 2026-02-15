import { IWhatsAppTemplateData } from "../../interfaces/IWhatsAppMessage";
import { SendWhatsAppMessageService } from "./SendWhatsAppMessageService";

class OrderStatusNotifierService {
    private sendWhatsAppService: SendWhatsAppMessageService;

    constructor() {
        this.sendWhatsAppService = new SendWhatsAppMessageService();
    }

    async execute(status: string, data: IWhatsAppTemplateData, phoneNumber: string) {
        try {
            let message = '';

            // Selecionar template baseado no status
            switch (status) {
                case 'OPENED':
                    message = this.buildOrderConfirmationTemplate(data);
                    break;
                
                case 'IN_DELIVERY':
                    message = this.buildOrderInDeliveryTemplate(data);
                    break;
                
                default:
                    console.log(`[OrderStatusNotifierService] Status ${status} não requer notificação`);
                    return { success: false, error: 'Status does not require notification' };
            }

            // Enviar mensagem
            const result = await this.sendWhatsAppService.execute({
                phone_number: phoneNumber,
                message
            });

            console.log(`[OrderStatusNotifierService] Notification sent for order ${data.order_code}, status: ${status}`);
            
            return result;

        } catch (error: any) {
            console.error("[OrderStatusNotifierService] Failed to notify:", error.message);
            return { success: false, error: error.message };
        }
    }

    private buildOrderConfirmationTemplate(data: IWhatsAppTemplateData): string {
        const storeName = data.store_name || 'Nossa Loja';
        const deliveryDate = new Date(data.delivery_date).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });

        return `🎉 *Pedido Confirmado!*

Olá *${data.client_name}*!

Seu pedido *#${data.order_code}* foi confirmado com sucesso! ✅

📦 *Detalhes do Pedido:*
💰 Valor Total: R$ ${data.total.toFixed(2)}
📅 Entrega Prevista: ${deliveryDate}
${data.delivery_address ? `📍 Endereço: ${data.delivery_address}` : ''}

Obrigado por comprar conosco! Estamos preparando seu pedido com muito carinho. ❤️

_${storeName}_
${data.store_phone ? `📞 ${data.store_phone}` : ''}`;
    }

    private buildOrderInDeliveryTemplate(data: IWhatsAppTemplateData): string {
        const storeName = data.store_name || 'Nossa Loja';

        return `🚚 *Pedido Saiu para Entrega!*

Olá *${data.client_name}*!

Seu pedido *#${data.order_code}* saiu para entrega! 🎉

📦 *Informações:*
💰 Valor: R$ ${data.total.toFixed(2)}
${data.delivery_address ? `📍 Endereço: ${data.delivery_address}` : ''}

Nosso entregador está a caminho! Em breve seu pedido chegará. 🏃‍♂️💨

_${storeName}_
${data.store_phone ? `📞 ${data.store_phone}` : ''}`;
    }
}

export { OrderStatusNotifierService };
