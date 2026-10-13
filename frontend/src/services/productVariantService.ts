import { api } from "./api";
import { IProductColor, IProductVariantInput } from "../interfaces/IProductVariant";

// -- Colors --
export const listProductColors = async () => {
    const response = await api.get("/product-color/all");
    return response;
};

export const createProductColor = async (color: Omit<IProductColor, 'id'>) => {
    const response = await api.post("/product-color", color);
    return response;
};

export const updateProductColor = async (color: IProductColor) => {
    const response = await api.put(`/product-color/${color.id}`, {
        name: color.name,
        hex: color.hex,
        is_mixed: color.is_mixed,
        sort_order: color.sort_order,
    });
    return response;
};

export const deleteProductColor = async (id: string) => {
    const response = await api.delete(`/product-color/${id}`);
    return response;
};

// -- Variant groups --
export const listProductVariantGroups = async (page: number, pageSize: number, query: string) => {
    const response = await api.get(`/product-variant-group/all?page=${page}&pageSize=${pageSize}&query=${encodeURIComponent(query)}`);
    return response;
};

export const createProductVariantGroup = async (data: { name: string; description?: string | null; variants: IProductVariantInput[] }) => {
    const response = await api.post("/product-variant-group", data);
    return response;
};

export const updateProductVariantGroup = async (id: string, data: { name: string; description?: string | null }) => {
    const response = await api.put(`/product-variant-group/${id}`, data);
    return response;
};

export const setProductVariants = async (id: string, variants: IProductVariantInput[]) => {
    const response = await api.put(`/product-variant-group/${id}/variants`, { variants });
    return response;
};

export const deleteProductVariantGroup = async (id: string) => {
    const response = await api.delete(`/product-variant-group/${id}`);
    return response;
};
