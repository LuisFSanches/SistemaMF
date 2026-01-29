import { describe, it, expect } from 'vitest';
import { maskSensitiveData, maskPaymentCredentials } from '../maskSensitiveData';

describe('maskSensitiveData', () => {
    it('should mask string showing only first 4 characters', () => {
        const result = maskSensitiveData('1234567890');
        expect(result).toBe('1234******');
    });

    it('should mask string with custom visible characters', () => {
        const result = maskSensitiveData('abcdefghij', 6);
        expect(result).toBe('abcdef****');
    });

    it('should mask entire string if length is less than or equal to visible chars', () => {
        const result = maskSensitiveData('abc', 4);
        expect(result).toBe('***');
    });

    it('should return null for null value', () => {
        const result = maskSensitiveData(null);
        expect(result).toBeNull();
    });

    it('should return null for undefined value', () => {
        const result = maskSensitiveData(undefined);
        expect(result).toBeNull();
    });

    it('should return null for empty string', () => {
        const result = maskSensitiveData('');
        expect(result).toBeNull();
    });
});

describe('maskPaymentCredentials', () => {
    it('should mask all payment credentials', () => {
        const credentials = {
            mp_access_token: 'APP_USR-1234567890',
            mp_public_key: 'APP_USR-0987654321',
            mp_seller_id: '123456789',
            mp_webhook_secret: 'webhook_secret_123',
            inter_client_id: 'client_123456',
            inter_client_secret: 'secret_123456',
            inter_api_cert_path: '/path/to/cert.pem',
            inter_api_key_path: '/path/to/key.pem',
        };

        const masked = maskPaymentCredentials(credentials);

        expect(masked.mp_access_token).toBe('APP_**************');
        expect(masked.mp_public_key).toBe('APP_**************');
        expect(masked.mp_seller_id).toBe('1234*****');
        expect(masked.mp_webhook_secret).toBe('webh**************');
        expect(masked.inter_client_id).toBe('clie**********');
        expect(masked.inter_client_secret).toBe('secr**********');
        expect(masked.inter_api_cert_path).toBe('/pat*************');
        expect(masked.inter_api_key_path).toBe('/pat************');
    });

    it('should handle null values', () => {
        const credentials = {
            mp_access_token: null,
            mp_public_key: null,
            mp_seller_id: null,
            mp_webhook_secret: null,
            inter_client_id: null,
            inter_client_secret: null,
            inter_api_cert_path: null,
            inter_api_key_path: null,
        };

        const masked = maskPaymentCredentials(credentials);

        expect(masked.mp_access_token).toBeNull();
        expect(masked.mp_public_key).toBeNull();
        expect(masked.mp_seller_id).toBeNull();
        expect(masked.mp_webhook_secret).toBeNull();
        expect(masked.inter_client_id).toBeNull();
        expect(masked.inter_client_secret).toBeNull();
        expect(masked.inter_api_cert_path).toBeNull();
        expect(masked.inter_api_key_path).toBeNull();
    });

    it('should handle mixed null and valid values', () => {
        const credentials = {
            mp_access_token: 'APP_USR-123',
            mp_public_key: null,
            mp_seller_id: '123456',
            mp_webhook_secret: null,
            inter_client_id: null,
            inter_client_secret: 'secret',
            inter_api_cert_path: null,
            inter_api_key_path: null,
        };

        const masked = maskPaymentCredentials(credentials);

        expect(masked.mp_access_token).toBe('APP_*******');
        expect(masked.mp_public_key).toBeNull();
        expect(masked.mp_seller_id).toBe('1234**');
        expect(masked.mp_webhook_secret).toBeNull();
        expect(masked.inter_client_id).toBeNull();
        expect(masked.inter_client_secret).toBe('secr**');
        expect(masked.inter_api_cert_path).toBeNull();
        expect(masked.inter_api_key_path).toBeNull();
    });
});
