export type WhatsAppTemplateVariableType =
    | "TEXT"
    | "STORE_NAME"
    | "COUPON_CODE"
    | "COUPON_DISCOUNT_VALUE"
    | "COUPON_MAX_DISCOUNT"
    | "COUPON_MIN_ORDER_AMOUNT";

export type WhatsAppTemplateHeaderType = "NONE" | "IMAGE" | "VIDEO" | "DOCUMENT";

export interface IWhatsAppTemplate {
    id: string;
    name: string;
    language_code: string;
    variable_count: number;
    variable_types: WhatsAppTemplateVariableType[];
    header_type: WhatsAppTemplateHeaderType;
    header_media_url?: string | null;
    preview_image_url?: string | null;
    created_at?: string | Date;
    updated_at?: string | Date;
}

export interface ICreateWhatsAppTemplateData {
    name: string;
    language_code?: string;
    variable_types: WhatsAppTemplateVariableType[];
    header_type?: WhatsAppTemplateHeaderType;
    header_media_url?: string | null;
    preview_image_url?: string | null;
}
