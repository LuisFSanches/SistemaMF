export const WHATSAPP_TEMPLATE_VARIABLE_TYPES = [
    "TEXT",
    "STORE_NAME",
    "COUPON_CODE",
    "COUPON_DISCOUNT_VALUE",
    "COUPON_MAX_DISCOUNT",
    "COUPON_MIN_ORDER_AMOUNT",
] as const;

export type WhatsAppTemplateVariableType = typeof WHATSAPP_TEMPLATE_VARIABLE_TYPES[number];

// Variable types that require a coupon to be linked to the campaign.
export const COUPON_DEPENDENT_VARIABLE_TYPES: WhatsAppTemplateVariableType[] = [
    "COUPON_CODE",
    "COUPON_DISCOUNT_VALUE",
    "COUPON_MAX_DISCOUNT",
    "COUPON_MIN_ORDER_AMOUNT",
];
