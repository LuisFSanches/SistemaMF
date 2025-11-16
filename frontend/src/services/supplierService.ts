import { api } from "./api";
const token = localStorage.getItem("token")?.replace(/"/g, '');

export const createSupplier = async (data: any) => {
    const response = await api.post("/supplier", data, {
        headers: { authorization: `${token}` }
    });
    return response;
};

export const getAllSuppliers = async () => {
    const response = await api.get("/supplier/all", {
        headers: { authorization: `${token}` }
    });
    return response;
};
