export interface IDeliveryRange {
    id?: string
    store_id: string
    min_km: number
    max_km: number
    price: number
    created_at?: Date
}
