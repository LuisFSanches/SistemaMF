export interface IWhatsAppMessage {
    phone_number: string
    customer_name?: string
    order_number?: string
    store_name?: string
}

export interface IWhatsAppTemplateData {
    order_id: string
    client_name: string
    order_code: number
    total: number
    delivery_date: Date
    delivery_address?: string
    store_name?: string
    store_phone?: string
}

export interface IWhatsAppResponse {
    success: boolean
    message_id?: string
    error?: string
}
