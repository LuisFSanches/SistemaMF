import https from 'https';

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

    const cert = process.env.BANCO_INTER_CERT_PEM_PATH!.replace(/(^"|"$)/g, '');
    const key = process.env.BANCO_INTER_KEY_PEM_PATH!.replace(/(^"|"$)/g, '');
    const ca = process.env.BANCO_INTER_CA_CERT_PATH!.replace(/(^"|"$)/g, '');

    const httpsOptions = new https.Agent({
        requestCert: true,
        rejectUnauthorized: false,
        key: Buffer.from(key, 'utf-8'),
        cert: Buffer.from(key, 'utf-8'),
        ca: Buffer.from(ca, 'utf-8')
    })
    
    return httpsOptions;
}
