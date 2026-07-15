import { api } from './api';

interface StockValidationItem {
        store_product_id: string;
        quantity: number;
}

export interface InvalidStockItem {
        store_product_id: string;
        product_name: string;
        requested_quantity: number;
        available_stock: number;
        has_stock: boolean;
        is_enabled: boolean;
        is_visible: boolean;
}

export interface StockValidationResponse {
        is_valid: boolean;
        invalid_items: InvalidStockItem[];
        message: string;
}

export const stockService = {
        async validateStock(items: StockValidationItem[]): Promise<StockValidationResponse> {
                const response = await api.post('/stock/validate', { items });
                return response.data;
        }
};
