import { api } from "./api";
import { ICreateStoreSchedule, IUpdateStoreSchedule } from "../interfaces/IStoreSchedule";

export const createStoreSchedule = async (data: ICreateStoreSchedule) => {
    const response = await api.post("/storeSchedule", data);
    return response.data;
};

export const getStoreSchedules = async (storeId: string) => {
    const response = await api.get(`/storeSchedule/store/${storeId}`);
    return response.data;
};

export const getStoreScheduleById = async (id: string) => {
    const response = await api.get(`/storeSchedule/${id}`);
    return response.data;
};

export const updateStoreSchedule = async (id: string, data: IUpdateStoreSchedule) => {
    const response = await api.put(`/storeSchedule/${id}`, data);
    return response.data;
};

export const deleteStoreSchedule = async (id: string) => {
    const response = await api.delete(`/storeSchedule/${id}`);
    return response.data;
};
