import https from 'https';
import fs from 'fs';
import axios from 'axios';

class GetInterAuthService{
    async execute({ httpsAgent }: { httpsAgent: https.Agent }) {
        try {
            const url = `https://cdpj.partners.bancointer.com.br/oauth/v2/token`;

            const credentials = Buffer.from(
                `${process.env.BANCO_INTER_CLIENT_ID}:${process.env.BANCO_INTER_CLIENT_SECRET}`
            ).toString('base64');

            const params = new URLSearchParams();
            params.append('client_id', process.env.BANCO_INTER_CLIENT_ID!);
            params.append('client_secret', process.env.BANCO_INTER_CLIENT_SECRET!);
            params.append('grant_type', 'client_credentials');
            params.append('scope', 'webhook.write webhook.read webhook-banking.write webhook-banking.read cob.write extrato.read');

            const response = await axios.post(
                url,
                params,
                {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    httpsAgent: httpsAgent,
                }
            );
        
            return response.data.access_token;

        } catch(error: any) {
            console.error('Error fetching access token:', error.response?.data || error.message);
            throw new Error('Failed to fetch access token');
        }
    }
}

export { GetInterAuthService }