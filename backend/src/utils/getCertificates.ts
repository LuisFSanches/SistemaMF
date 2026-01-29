import https from 'https';
import * as fs from 'fs';
import * as path from 'path';
import prismaClient from '../prisma';
import { BadRequestException } from '../exceptions/bad-request';
import { ErrorCodes } from '../exceptions/root';

const pathCerts =  path.join(__dirname,'..','certs');

export const getCertificates = async (store_id: string) => {
    // Buscar credenciais da loja no banco de dados
    const store = await prismaClient.store.findUnique({
        where: { id: store_id },
        select: {
            inter_api_cert_path: true,
            inter_api_key_path: true,
        },
    });

    if (!store || !store.inter_api_cert_path || !store.inter_api_key_path) {
        throw new BadRequestException(
            'Store payment credentials not configured',
            ErrorCodes.BAD_REQUEST
        );
    }

    const cert = store.inter_api_cert_path.replace(/(^"|"$)/g, '');
    const key = store.inter_api_key_path.replace(/(^"|"$)/g, '');

    const httpsAgent = new https.Agent({
        host: 'cdpj.partners.bancointer.com.br',
        cert: Buffer.from(cert, 'utf-8'),
        key: Buffer.from(key, 'utf-8'),
        rejectUnauthorized: true
    })
    
    return httpsAgent;
};

export const getCertificatesForWebhook = () => {

    const cert = path.join(pathCerts, 'cert.pem');
    const key = path.join(pathCerts, 'key.pem');
    const ca = path.join(pathCerts, 'ca.crt');

    const httpsOptions = {
        requestCert: true,
        rejectUnauthorized: false,
        cert: fs.readFileSync(cert),
        key: fs.readFileSync(key),
        ca: fs.readFileSync(ca)
    };
    
    return httpsOptions;
}

export const getSicrediCertificates = () => {
    const cert = process.env.SICREDI_CERT_PATH!.replace(/(^"|"$)/g, '');
    const key = process.env.SICREDI_KEY_PATH!.replace(/(^"|"$)/g, '');
    const passphrase = process.env.SICREDI_CERT_PASSPHRASE!;

    const isProduction = process.env.SICREDI_PRODUCTION === '1';
    const host = isProduction ? 'api-pix.sicredi.com.br' : 'api-pix-h.sicredi.com.br';

    const httpsAgent = new https.Agent({
        host: host,
        cert: Buffer.from(cert, 'utf-8'),
        key: Buffer.from(key, 'utf-8'),
        passphrase: passphrase,
        rejectUnauthorized: true
    });

    return httpsAgent;
};
