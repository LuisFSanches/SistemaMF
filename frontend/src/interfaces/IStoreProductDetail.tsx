export interface IStoreProductDetail {
    id: string;
    store_id: string;
    product_id: string;
    price: number;
    stock: number;
    enabled: boolean;
    visible_for_online_store: boolean;
    product: {
        id: string;
        name: string;
        unity: string;
        description: string | null;
        image: string | null;
        image_2: string | null;
        image_3: string | null;
        categories: Array<{
            category: {
                id: string;
                name: string;
                slug: string;
            };
        }>;
    };
    created_at: string;
    updated_at: string;
}
