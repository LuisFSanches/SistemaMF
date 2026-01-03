import { api } from "./api";

export const getPix = async (params: any) => {
    const response = await api.get(`/pix/${params}`);

    return response;
};