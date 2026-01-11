import { z } from "zod";

export const updateStoreCredentialsSchema = z.object({
    // Mercado Pago
    mp_access_token: z.string().optional(),
    mp_public_key: z.string().optional(),
    mp_seller_id: z.string().optional(),
    mp_webhook_secret: z.string().optional(),
    
    // Banco Inter
    inter_client_id: z.string().optional(),
    inter_client_secret: z.string().optional(),
    inter_api_cert_path: z.string().optional(),
    inter_api_key_path: z.string().optional(),
    
    payment_enabled: z.boolean().optional(),
});

export type UpdateStoreCredentialsSchemaType = z.infer<typeof updateStoreCredentialsSchema>;
