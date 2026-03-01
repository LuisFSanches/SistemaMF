export interface IStoreCarousel {
    id?: string
    store_id: string
    name: string
    is_active?: boolean
    product_ids?: string[]
}

export interface IUpdateStoreCarousel {
    id: string
    name?: string
    is_active?: boolean
    product_ids?: string[]
}
