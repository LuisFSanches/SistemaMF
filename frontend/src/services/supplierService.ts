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

export const getSupplierStockDetails = async (id: string) => {
        const response = await api.get(`/supplier/${id}/stock`);
        return response;
};
