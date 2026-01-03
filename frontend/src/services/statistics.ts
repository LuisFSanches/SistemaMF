import { api } from "./api";

export const getTopClients = async (params: any) => {
    const response = await api.get(`/statistics/top-clients/${params}`);

    return response.data;
};

export const getTopAdmins = async (params: any) => {
    const response = await api.get(`/statistics/top-admins`);

    return response.data;
};

export const getDailySales = async (params: any) => {
    const response = await api.get(`/statistics/daily-sales/${params}`);

    return response.data;
};
