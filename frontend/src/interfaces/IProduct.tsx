export interface IProduct {
    id?: string;
    name: string;
    image?: string;
    price: number|null;
    unity: string;
    stock: number;
    enabled: boolean;
}