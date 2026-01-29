export interface IProduct {
    id?: string;
    name: string;
    image?: string;
    image_2?: string;
    image_3?: string;
    price: number|null;
    unity: string;
    stock: number;
    enabled: boolean;
    visible_in_store?: boolean;
    qr_code?: string;
}