import { api } from "./api";
import { ICreateSpecialDateData } from "../interfaces/specialDate";

export const createSpecialDate = async (data: ICreateSpecialDateData) => {
    const response = await api.post("/admin/special-dates", data);
    return response;
};

export const listSpecialDates = async () => {
    const response = await api.get("/admin/special-dates");
    return response;
};

export const updateSpecialDate = async (id: string, data: Partial<ICreateSpecialDateData>) => {
    const response = await api.put(`/admin/special-dates/${id}`, data);
    return response;
};

export const deleteSpecialDate = async (id: string) => {
    const response = await api.delete(`/admin/special-dates/${id}`);
    return response;
};
