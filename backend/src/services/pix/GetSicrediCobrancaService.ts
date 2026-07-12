import axios from 'axios';
import https from 'https';

class GetSicrediCobrancaService {
    async execute(token: string, httpsAgent: https.Agent, txid: string) {
        try {
            const isProduction = process.env.SICREDI_PRODUCTION === '1';
            const baseUrl = isProduction 
                ? 'https://api-pix.sicredi.com.br' 
                : 'https://api-pix-h.sicredi.com.br';

            const url = `${baseUrl}/api/v2/cob/${txid}`;

            const response = await axios.get(url, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                httpsAgent
            });

            return response.data;
        } catch (error: any) {
            console.error('[GetSicrediCobrancaService] Error:', error.response?.data || error.message);
            throw new Error('Failed to get Sicredi cobrança');
        }
    }
}

export { GetSicrediCobrancaService };
