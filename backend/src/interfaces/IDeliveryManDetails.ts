export interface IDeliveryManDetails {
    deliveryMan: {
        name: string
        phone_number: string
    }
    deliveries: IDeliveryItem[]
    deliveryHistory: IDeliveryHistoryItem[]
    summary: {
        total_deliveries: number
        total_paid: number
        pending_payment: number
    }
}

export interface IDeliveryItem {
    id: string
    order_code: number
    delivery_date: Date
    delivery_fee: number
    is_paid: boolean
}

export interface IDeliveryHistoryItem {
    date: string
    count: number
    total: number
}
