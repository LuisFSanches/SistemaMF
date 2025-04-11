import { api } from "./api";
const token = localStorage.getItem("token")?.replace(/"/g, '');

export const getDashboard = async (period: string) => {
    const response = await api.get(`/dashboard?period=${period}`, {
        headers: {
            Authorization: `${token}`,
        }
    });

    return response;
};
