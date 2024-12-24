import https from 'https';
import * as fs from 'fs';
import * as path from 'path';

const pathCerts =  path.join(__dirname,'..','certs');

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
