import { api } from "./api";

export const getDashboard = async (period: string, startDate?: string | null, endDate?: string | null) => {
    let url = `/dashboard?period=${period}`;
    
    if (startDate && endDate) {
        url += `&startDate=${startDate}&endDate=${endDate}`;
    }
    
    const response = await api.get(url);

    return response;
};
