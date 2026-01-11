import { api, getStoreId } from "./api";

export const createSupplier = async (data: any) => {
    const store_id = getStoreId();
    const response = await api.post("/supplier", { ...data, store_id });
    return response;
};

export const getAllSuppliers = async () => {
    const response = await api.get("/supplier/all");
    return response;
};
