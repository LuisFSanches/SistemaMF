export interface IProduct {
    id?: string;
    name: string;
    price: number;
    unity: string;
    stock: number;
    enabled: boolean;
    image?: string;
    visible_in_store?: boolean;
}
