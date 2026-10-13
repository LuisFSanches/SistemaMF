import { IProductColor, IStoreProductVariant } from "./IProductVariant";

export interface IStoreProductDetail {
        id: string;
        store_id: string;
        product_id: string;
        price: number;
        stock: number;
        enabled: boolean;
        visible_for_online_store: boolean;
        description: string | null;
        is_description_from_parent?: boolean;
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
        color?: IProductColor | null;
        variant_group?: { id: string; name: string } | null;
        variants?: IStoreProductVariant[];
        created_at: string;
        updated_at: string;
}
