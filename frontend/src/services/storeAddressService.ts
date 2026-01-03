import { api } from "./api";
import { ICreateStoreAddress, IUpdateStoreAddress } from "../interfaces/IStoreAddress";

export const createStoreAddress = async (data: ICreateStoreAddress) => {
    const response = await api.post("/storeAddress", data);
    return response.data;
};

export const getStoreAddresses = async (storeId: string) => {
    const response = await api.get(`/storeAddress/store/${storeId}`);
    return response.data;
};

export const getStoreAddressById = async (id: string) => {
    const response = await api.get(`/storeAddress/${id}`);
    return response.data;
};

export const updateStoreAddress = async (id: string, data: IUpdateStoreAddress) => {
    const response = await api.put(`/storeAddress/${id}`, data);
    return response.data;
};

export const deleteStoreAddress = async (id: string) => {
    const response = await api.delete(`/storeAddress/${id}`);
    return response.data;
};
