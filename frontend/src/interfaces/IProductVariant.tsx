export interface IProductColor {
    id: string;
    name: string;
    hex: string | null;
    is_mixed: boolean;
    sort_order?: number;
    _count?: { products: number };
}

// One color of a store product, as returned by the storefront / PDV listings
export interface IStoreProductVariant {
    id: string;              // store_product id
    product_id: string;
    name: string;
    price: number;
    stock: number;
    image: string | null;
    available: boolean;
    variant_order: number;
    color: IProductColor | null;
}

export interface IProductVariantGroupMember {
    id: string;              // global product id
    name: string;
    price: number;
    image: string | null;
    enabled: boolean;
    sales_count: number;
    variant_order: number;
    color: IProductColor | null;
}

export interface IProductVariantGroup {
    id: string;
    name: string;
    description: string | null;
    products: IProductVariantGroupMember[];
}

export interface IProductVariantInput {
    product_id: string;
    color_id: string;
    variant_order?: number;
}
