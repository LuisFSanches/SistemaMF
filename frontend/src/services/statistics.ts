import { api } from "./api";
const token = localStorage.getItem("token")?.replace(/"/g, '');

export const getTopClients = async (params: any) => {
    const response = await api.get(`/statistics/top-clients/${params}`, {
        headers: {
            Authorization: `${token}`,
        }
    });

    return response.data;
};

export const getDailySales = async (params: any) => {
    const response = await api.get(`/statistics/daily-sales/${params}`, {
        headers: {
            Authorization: `${token}`,
        }
    });

    return response.data;
};