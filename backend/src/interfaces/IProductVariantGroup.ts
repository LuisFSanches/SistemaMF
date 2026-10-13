export interface IProductVariantItem {
    product_id: string
    color_id: string
    variant_order?: number
}

export interface IProductVariantGroup {
    id?: string
    name: string
    description?: string | null
    variants?: IProductVariantItem[]
    created_at?: Date
    updated_at?: Date
}

// A sibling color of a store product, as shown in the storefront / PDV color selector
export interface IStoreProductVariant {
    id: string              // store_product id
    product_id: string
    name: string
    price: number
    stock: number
    image: string | null
    available: boolean
    variant_order: number
    color: {
        id: string
        name: string
        hex: string | null
        is_mixed: boolean
    } | null
}
