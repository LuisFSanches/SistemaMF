import https from 'https';
import fs from 'fs';

export const getCertificates = () => {

    const httpsAgent = new https.Agent({
        host: 'cdpj.partners.bancointer.com.br',
        cert: Buffer.from(process.env.BANCO_INTER_API_CERT_PATH!, 'utf-8'),
        key: Buffer.from(process.env.BANCO_INTER_API_KEY_PATH!, 'utf-8'),
        rejectUnauthorized: true
    })
    
    return httpsAgent;
};

export const getApiCertificates = () => {
    console.log(process.env.BANCO_INTER_CERT_PEM_PATH)
    const httpsAgent = new https.Agent({
        cert: fs.readFileSync(process.env.BANCO_INTER_CERT_PEM_PATH!),
        key: fs.readFileSync(process.env.BANCO_INTER_KEY_PEM_PATH!),
        ca: fs.readFileSync(process.env.BANCO_INTER_API_CERT_PATH!),
    })
    
    return httpsAgent;
};