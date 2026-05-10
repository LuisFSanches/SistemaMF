import { api } from "./api";

export const getDashboard = async (startDate: string, endDate: string) => {
    const response = await api.get(`/dashboard?startDate=${startDate}&endDate=${endDate}`);

    return response;
};
