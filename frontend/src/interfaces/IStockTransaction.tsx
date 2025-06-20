import { IProduct } from "./IProduct";

export interface IStockTransaction {
    id?: string,
    product_id: string,
    supplier: string,
    unity: string,
    quantity: number,
    unity_price: number,
    total_price: number,
    purchased_date: string,
    product?: IProduct
}