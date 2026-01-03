import { api } from "./api";
import { ICreateStoreHoliday, IUpdateStoreHoliday } from "../interfaces/IStoreHoliday";

export const createStoreHoliday = async (data: ICreateStoreHoliday) => {
    const response = await api.post("/storeHoliday", data);
    return response.data;
};

export const getStoreHolidays = async (storeId: string) => {
    const response = await api.get(`/storeHoliday/store/${storeId}`);
    return response.data;
};

export const getStoreHolidayById = async (id: string) => {
    const response = await api.get(`/storeHoliday/${id}`);
    return response.data;
};

export const updateStoreHoliday = async (id: string, data: IUpdateStoreHoliday) => {
    const response = await api.put(`/storeHoliday/${id}`, data);
    return response.data;
};

export const deleteStoreHoliday = async (id: string) => {
    const response = await api.delete(`/storeHoliday/${id}`);
    return response.data;
};
