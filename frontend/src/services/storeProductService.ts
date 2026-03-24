import { api } from "./api";

export const createStoreProduct = async (data: {
    store_id: string;
    product_id: string;
    price: number;
    stock: number;
    enabled: boolean;
    visible_for_online_store: boolean;
}) => {
    const response = await api.post("/store-product", data);
    return response;
};

export const listStoreProducts = async (storeId: string, query: string = '') => {
    const response = await api.get(`/store-product/all?store_id=${storeId}&query=${encodeURIComponent(query)}`);
    return response;
};

export const listOnlineStoreProducts = async (storeId: string, page: number = 1, pageSize: number = 8, query: string = '') => {
    const response = await api.get(`/store-product/online?store_id=${storeId}&page=${page}&pageSize=${pageSize}&query=${encodeURIComponent(query)}`);
    return response;
};

export const getStoreProductById = async (id: string) => {
    const response = await api.get(`/store-product/${id}`);
    return response;
};

export const searchStoreProducts = async (query: string) => {
    const response = await api.get(`/store-product/search?q=${query}`);
    
    return response;
}

export const updateStoreProduct = async (data: {
    id: string;
    price?: number;
    stock?: number;
    enabled?: boolean;
    visible_for_online_store?: boolean;
}) => {
    const response = await api.put(`/store-product/${data.id}`, data);
    return response;
};

export const deleteStoreProduct = async (id: string) => {
    const response = await api.delete(`/store-product/${id}`);
    return response;
};
