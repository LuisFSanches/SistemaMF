import { api } from "./api";
import { ICreateOrderDelivery, IUpdateOrderDelivery } from "../interfaces/IOrderDelivery";

const token = localStorage.getItem("token")?.replace(/"/g, '');

export const createOrderDelivery = async (data: ICreateOrderDelivery) => {
    const response = await api.post("/orderDelivery", data, {
        headers: {
            authorization: token,
        },
    });
    return response.data;
};

export const getAllOrderDeliveries = async (page: number, pageSize: number, query: string, filter?: string) => {
    let url = `/orderDelivery/all?page=${page}&pageSize=${pageSize}&query=${query}`;
    
    if (filter && filter !== 'all') {
        url += `&filter=${filter}`;
    }
    
    const response = await api.get(url, {
        headers: {
            authorization: token,
        },
    });
    return response.data;
};

export const getOrderDeliveryById = async (id: string) => {
    const response = await api.get(`/orderDelivery/${id}`, {
        headers: {
            authorization: token,
        },
    });
    return response.data;
};

export const updateOrderDelivery = async (id: string, data: IUpdateOrderDelivery) => {
    const response = await api.put(`/orderDelivery/${id}`, data, {
        headers: {
            authorization: token,
        },
    });
    return response.data;
};

export const deleteOrderDelivery = async (id: string) => {
    const response = await api.delete(`/orderDelivery/${id}`, {
        headers: {
            authorization: token,
        },
    });
    return response.data;
};

export const bulkUpdateOrderDeliveries = async (ids: string[], data: IUpdateOrderDelivery) => {
    const response = await api.patch("/orderDelivery/bulk-update", {
        ids,
        ...data
    }, {
        headers: {
            authorization: token,
        },
    });
    return response.data;
};
