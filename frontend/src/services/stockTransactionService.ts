import { api } from "./api";
import { IStockTransaction } from "../interfaces/IStockTransaction";

const token = localStorage.getItem("token")?.replace(/"/g, '');

export const createStockTransaction = async ({
    product_id,
    supplier,
    unity,
    quantity,
    unity_price,
    total_price,
    purchased_date
}: IStockTransaction) => {
    const response = await api.post("/stockTransaction", {
        product_id,
        supplier,
        unity,
        quantity: Number(quantity),
        unity_price: Number(unity_price),
        total_price: Number(total_price),
        purchased_date
    }, {
        headers: {
            Authorization: `${token}`,
        }
    });
    return response;
};

export const getStockTransactions = async (page: number, pageSize: number, query: string) => {
    const response = await api.get(`/stockTransaction/all?page=${page}&pageSize=${pageSize}&query=${query}`, {
        headers: {
            Authorization: `${token}`,
        }
    });
    
    return response;
};

export const deleteStockTransaction = async (id: string) => {
    const response = await api.delete(`/stockTransaction/${id}`, {
        headers: {
            Authorization: `${token}`,
        }
    });
    
    return response;
};

export const getProductStockTransactions = async (productId: string) => {
    const response = await api.get(`/stockTransaction/product/${productId}`, {
        headers: {
            Authorization: `${token}`,
        }
    });
    
    return response;
};
