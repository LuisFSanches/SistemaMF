import { api } from "./api";
import { ICreateOrderDelivery, IUpdateOrderDelivery } from "../interfaces/IOrderDelivery";

export const createOrderDelivery = async (data: ICreateOrderDelivery) => {
    const response = await api.post("/orderDelivery", data);
    return response.data;
};

export const getAllOrderDeliveries = async (page: number, pageSize: number, query: string, filter?: string, startDate?: string | null, endDate?: string | null) => {
    let url = `/orderDelivery/all?page=${page}&pageSize=${pageSize}&query=${query}`;
    
    if (filter && filter !== 'all') {
        url += `&filter=${filter}`;
    }
    
    if (startDate) {
        url += `&startDate=${startDate}`;
    }
    
    if (endDate) {
        url += `&endDate=${endDate}`;
    }
    
    const response = await api.get(url);
    return response.data;
};

export const getOrderDeliveryById = async (id: string) => {
    const response = await api.get(`/orderDelivery/${id}`);
    return response.data;
};

export const updateOrderDelivery = async (id: string, data: IUpdateOrderDelivery) => {
    const response = await api.put(`/orderDelivery/${id}`, data);
    return response.data;
};

export const deleteOrderDelivery = async (id: string) => {
    const response = await api.delete(`/orderDelivery/${id}`);
    return response.data;
};

export const bulkUpdateOrderDeliveries = async (ids: string[], data: IUpdateOrderDelivery) => {
    const response = await api.patch("/orderDelivery/bulk-update", {
        ids,
        ...data
    });
    return response.data;
};
