import axios from 'axios';
import https from 'https';
import { ISicrediCobranca } from '../../interfaces/ISicrediPix';

class CreateSicrediCobrancaService {
    async execute(token: string, httpsAgent: https.Agent, data: ISicrediCobranca) {
        try {
            const isProduction = process.env.SICREDI_PRODUCTION === '1';
            const baseUrl = isProduction 
                ? 'https://api-pix.sicredi.com.br' 
                : 'https://api-pix-h.sicredi.com.br';

            const url = `${baseUrl}/api/v2/cob`;

            const response = await axios.post(url, data, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                httpsAgent
            });

            return response.data;
        } catch (error: any) {
            console.error('[CreateSicrediCobrancaService] Error:', error.response?.data || error.message);
            throw new Error('Failed to create Sicredi cobrança');
        }
    }
}

export { CreateSicrediCobrancaService };
