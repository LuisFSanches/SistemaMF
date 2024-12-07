import https from 'https';
import fs from 'fs';

export const getCertificates = () => {

    const cert = process.env.BANCO_INTER_API_CERT_PATH!.replace(/(^"|"$)/g, '');
    const key = process.env.BANCO_INTER_API_KEY_PATH!.replace(/(^"|"$)/g, '');

    const httpsAgent = new https.Agent({
        host: 'cdpj.partners.bancointer.com.br',
        cert: Buffer.from(cert, 'utf-8'),
        key: Buffer.from(key, 'utf-8'),
        rejectUnauthorized: true
    })
    
    return httpsAgent;
};
