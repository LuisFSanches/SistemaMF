export interface IStoreProduct {
    id?: string
    store_id: string
    product_id: string
    price: number
    stock: number
    enabled?: boolean
    visible_for_online_store?: boolean
}
