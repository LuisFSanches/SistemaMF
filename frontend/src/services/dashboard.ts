import { api } from "./api";

export const getDashboard = async (period: string) => {
    const response = await api.get(`/dashboard?period=${period}`);

    return response;
};
