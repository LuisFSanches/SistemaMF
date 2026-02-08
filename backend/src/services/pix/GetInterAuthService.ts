import https from 'https';
import fs from 'fs';
import axios from 'axios';
import prismaClient from '../../prisma';
import { BadRequestException } from '../../exceptions/bad-request';
import { ErrorCodes } from '../../exceptions/root';

class GetInterAuthService {
    private static token: string | null = null;
    private static tokenExpiresAt: number = 0;

    async execute({ httpsAgent, store_id }: { httpsAgent: https.Agent; store_id: string }) {
        const now = Date.now();

        if (GetInterAuthService.token && now < GetInterAuthService.tokenExpiresAt) {
            return GetInterAuthService.token;
        }

        const store = await prismaClient.store.findUnique({
            where: { id: store_id },
            select: {
                inter_client_id: true,
                inter_client_secret: true,
            },
        });

        if (!store || !store.inter_client_id || !store.inter_client_secret) {
            throw new BadRequestException(
                'Store Inter credentials not configured',
                ErrorCodes.BAD_REQUEST
            );
        }

        try {
            const url = `https://cdpj.partners.bancointer.com.br/oauth/v2/token`;

            const params = new URLSearchParams();
            params.append('client_id', store.inter_client_id);
            params.append('client_secret', store.inter_client_secret);
            params.append('grant_type', 'client_credentials');
            params.append('scope', 'webhook.write webhook.read webhook-banking.write webhook-banking.read cob.write extrato.read');

            const response = await axios.post(url, params, {
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                httpsAgent: httpsAgent,
            });

            GetInterAuthService.token = response.data.access_token;
            GetInterAuthService.tokenExpiresAt = now + 55 * 60 * 1000;

            return GetInterAuthService.token;
        } catch (error: any) {
            console.error('Error fetching access token:', error.response?.data || error.message);
            throw new Error('Failed to fetch access token');
        }
    }
}


export { GetInterAuthService }