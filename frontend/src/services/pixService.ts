import { api } from "./api";
const token = localStorage.getItem("token")?.replace(/"/g, '');

export const getPix = async (params: any) => {
    const response = await api.get(`/pix/${params}`, {
        headers: {
            Authorization: `${token}`,
        }
    });

    return response;
};