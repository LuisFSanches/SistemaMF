import axios from 'axios';
import https from 'https';

class DeleteSicrediWebhookService {
    async execute(token: string, httpsAgent: https.Agent, chave: string) {
        try {
            const isProduction = process.env.SICREDI_PRODUCTION === '1';
            const baseUrl = isProduction 
                ? 'https://api-pix.sicredi.com.br' 
                : 'https://api-pix-h.sicredi.com.br';

            const url = `${baseUrl}/api/v2/webhook/${chave}`;

            const response = await axios.delete(url, {
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                httpsAgent
            });

            return response.data;
        } catch (error: any) {
            console.error('[DeleteSicrediWebhookService] Error:', error.response?.data || error.message);
            throw new Error('Failed to delete Sicredi webhook');
        }
    }
}

export { DeleteSicrediWebhookService };
