import https from 'https';
import fs from 'fs';

export const getCertificates = () => {

    console.log('certificado', process.env.BANCO_INTER_API_CERT_PATH)
    const httpsAgent = new https.Agent({
        host: 'cdpj.partners.bancointer.com.br',
        cert: Buffer.from(process.env.BANCO_INTER_API_CERT_PATH!, 'utf-8'),
        key: Buffer.from(process.env.BANCO_INTER_API_KEY_PATH!, 'utf-8'),
        rejectUnauthorized: true
    })
    
    return httpsAgent;
};
