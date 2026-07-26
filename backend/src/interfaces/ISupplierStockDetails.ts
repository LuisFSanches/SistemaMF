export interface ISupplierInfo {
    id: string;
    name: string;
}

export interface ISupplierStockTransactionDetails {
    id: string;
    purchased_date: Date;
    store_product_id: string | null;
    product_name: string;
    unity: string;
    quantity: number;
    unity_price: number;
    total_price: number;
}

export interface ISupplierStockMetrics {
    total_transactions: number;
    total_quantity_purchased: number;
    total_spent: number;
    average_price: number;
    last_purchase_date: Date | null;
}

export interface ISupplierStockDetails {
    supplier_info: ISupplierInfo;
    transactions: ISupplierStockTransactionDetails[];
    metrics: ISupplierStockMetrics;
}
