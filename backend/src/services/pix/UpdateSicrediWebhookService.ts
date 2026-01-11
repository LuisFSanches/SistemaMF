import axios from 'axios';
import https from 'https';

class UpdateSicrediWebhookService {
    async execute(token: string, httpsAgent: https.Agent, chave: string, webhookUrl: string) {
        try {
            const isProduction = process.env.SICREDI_PRODUCTION === '1';
            const baseUrl = isProduction 
                ? 'https://api-pix.sicredi.com.br' 
                : 'https://api-pix-h.sicredi.com.br';

            const url = `${baseUrl}/api/v2/webhook/${chave}`;

            const response = await axios.put(url, { webhookUrl }, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                httpsAgent
            });

            return response.data;
        } catch (error: any) {
            console.error('[UpdateSicrediWebhookService] Error:', error.response?.data || error.message);
            throw new Error('Failed to update Sicredi webhook');
        }
    }
}

export { UpdateSicrediWebhookService };
