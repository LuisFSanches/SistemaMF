export interface ICartItem {
    store_product_id: string
    quantity: number
}

export interface IStockValidationRequest {
    items: ICartItem[]
}

export interface IProductStockStatus {
    store_product_id: string
    product_name: string
    requested_quantity: number
    available_stock: number
    has_stock: boolean
    is_enabled: boolean
    is_visible: boolean
}

export interface IStockValidationResponse {
    is_valid: boolean
    invalid_items: IProductStockStatus[]
    message?: string
}
