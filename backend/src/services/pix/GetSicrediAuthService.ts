import https from 'https';
import axios from 'axios';

class GetSicrediAuthService {
    private static token: string | null = null;
    private static tokenExpiresAt: number = 0;

    async execute({ httpsAgent }: { httpsAgent: https.Agent }) {
        const now = Date.now();

        if (GetSicrediAuthService.token && now < GetSicrediAuthService.tokenExpiresAt) {
            return GetSicrediAuthService.token;
        }

        try {
            const isProduction = process.env.SICREDI_PRODUCTION === '1';
            const baseUrl = isProduction 
                ? 'https://api-pix.sicredi.com.br' 
                : 'https://api-pix-h.sicredi.com.br';

            const url = `${baseUrl}/oauth/token`;

            const authorization = Buffer.from(
                `${process.env.SICREDI_CLIENT_ID}:${process.env.SICREDI_CLIENT_SECRET}`
            ).toString('base64');

            const params = new URLSearchParams();
            params.append('grant_type', 'client_credentials');
            params.append('scope', 'cob.write cob.read webhook.read webhook.write');

            const response = await axios.post(url, params, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': `Basic ${authorization}`,
                },
                httpsAgent: httpsAgent,
            });

            GetSicrediAuthService.token = response.data.access_token;
            GetSicrediAuthService.tokenExpiresAt = now + 55 * 60 * 1000;

            return GetSicrediAuthService.token;
        } catch (error: any) {
            console.error('[GetSicrediAuthService] Error fetching access token:', error.response?.data || error.message);
            throw new Error('Failed to fetch Sicredi access token');
        }
    }
}

export { GetSicrediAuthService };
