import { api, getStoreId } from "./api";
import { IStockTransaction } from "../interfaces/IStockTransaction";

export const createStockTransaction = async ({
        store_product_id,
        supplier,
        unity,
        quantity,
        unity_price,
        total_price,
        purchased_date
}: IStockTransaction) => {
        const store_id = getStoreId();
        const response = await api.post("/stockTransaction", {
                store_id,
                store_product_id,
                supplier,
                unity,
                quantity: Number(quantity),
                unity_price: Number(unity_price),
                total_price: Number(total_price),
                purchased_date
        });
        return response;
};

export const getStockTransactions = async (page: number, pageSize: number, query: string, supplierId?: string) => {
        let url = `/stockTransaction/all?page=${page}&pageSize=${pageSize}&query=${encodeURIComponent(query)}`;

        if (supplierId) {
                url += `&supplier_id=${supplierId}`;
        }

        const response = await api.get(url);

        return response;
};

export const deleteStockTransaction = async (id: string) => {
        const response = await api.delete(`/stockTransaction/${id}`);
        
        return response;
};

export const getProductStockTransactions = async (productId: string) => {
        const response = await api.get(`/stockTransaction/product/${productId}`);
        
        return response;
};
