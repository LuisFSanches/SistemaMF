export interface IStoreCarouselItem {
    id: string;
    carousel_id: string;
    store_product_id: string;
    position: number;
    created_at: string;
    storeProduct: {
        id: string;
        price: number;
        stock: number;
        product: {
            id: string;
            name: string;
            image: string | null;
            image_2?: string | null;
            image_3?: string | null;
            price: number;
            unity: string;
            description?: string;
            sales_count?: number;
            categories?: Array<{
                id: string;
                category: {
                    id: string;
                    name: string;
                    slug: string;
                };
            }>;
        };
    };
}

export interface IStoreCarousel {
    id: string;
    store_id: string;
    name: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
    items: IStoreCarouselItem[];
}
