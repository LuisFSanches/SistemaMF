export interface IProductInfo {
    id: string;
    name: string;
    image: string | null;
    price: number;
}

export interface IStockTransactionDetails {
    id: string;
    purchased_date: Date;
    supplier: string;
    unity: string;
    quantity: number;
    unity_price: number;
    total_price: number;
}

export interface IPriceHistory {
    date: Date;
    unity_price: number;
}

export interface IStockMetrics {
    total_quantity_purchased: number;
    current_stock: number;
    average_price: number;
    last_purchase_date: Date | null;
}

export interface IProductStockDetails {
    product_info: IProductInfo;
    transactions: IStockTransactionDetails[];
    price_history: IPriceHistory[];
    metrics: IStockMetrics;
}
