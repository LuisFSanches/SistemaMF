/**
 * Mascara dados sensíveis mostrando apenas os primeiros caracteres
 * @param value - Valor a ser mascarado
 * @param visibleChars - Quantidade de caracteres visíveis (padrão: 4)
 * @returns String mascarada ou null se o valor for null/undefined
 */
export function maskSensitiveData(value: string | null | undefined, visibleChars: number = 4): string | null {
    if (!value) return null;
    
    if (value.length <= visibleChars) {
        return '*'.repeat(value.length);
    }
    
    const visible = value.substring(0, visibleChars);
    const hidden = '*'.repeat(value.length - visibleChars);
    
    return `${visible}${hidden}`;
}

/**
 * Mascara credenciais de pagamento de uma loja
 * @param credentials - Objeto com as credenciais da loja
 * @returns Objeto com credenciais mascaradas
 */
export function maskPaymentCredentials(credentials: {
    mp_access_token?: string | null;
    mp_public_key?: string | null;
    mp_seller_id?: string | null;
    mp_webhook_secret?: string | null;
    inter_client_id?: string | null;
    inter_client_secret?: string | null;
    inter_api_cert_path?: string | null;
    inter_api_key_path?: string | null;
}) {
    return {
        mp_access_token: maskSensitiveData(credentials.mp_access_token),
        mp_public_key: maskSensitiveData(credentials.mp_public_key),
        mp_seller_id: maskSensitiveData(credentials.mp_seller_id),
        mp_webhook_secret: maskSensitiveData(credentials.mp_webhook_secret),
        inter_client_id: maskSensitiveData(credentials.inter_client_id),
        inter_client_secret: maskSensitiveData(credentials.inter_client_secret),
        inter_api_cert_path: maskSensitiveData(credentials.inter_api_cert_path),
        inter_api_key_path: maskSensitiveData(credentials.inter_api_key_path),
    };
}
