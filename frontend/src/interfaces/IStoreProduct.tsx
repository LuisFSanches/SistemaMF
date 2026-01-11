export interface IStoreProduct {
    id?: string;
    name: string;
    image?: string;
    price: number|null;
    stock: number;
    enabled: boolean;
    visible_for_online_store?: boolean;
}