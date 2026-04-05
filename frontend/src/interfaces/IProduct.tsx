export interface IProduct {
    id?: string;
    name: string;
    description?: string;
    image?: string;
    image_2?: string;
    image_3?: string;
    is_image_from_parent?: boolean;
    is_image_2_from_parent?: boolean;
    is_image_3_from_parent?: boolean;
    is_description_from_parent?: boolean;
    price: number|null;
    unity: string;
    stock: number;
    enabled: boolean;
    visible_in_store?: boolean;
    visible_for_online_store?: boolean;
    qr_code?: string;
}