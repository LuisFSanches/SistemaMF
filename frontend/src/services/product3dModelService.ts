import { api } from "./api";

export const listProducts3DModels = async (query: string) => {
    const response = await api.get(`/product/3d-models?query=${query}`);

    return response;
};

export const getProduct3DModel = async (productId: string) => {
    const response = await api.get(`/product/${productId}/3d-model`);

    return response;
};

export const uploadProduct3DModel = async (productId: string, file: File) => {
    const formData = new FormData();
    formData.append('model', file);

    const response = await api.post(`/product/${productId}/3d-model`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        }
    });

    return response;
};

export const replaceProduct3DModel = async (productId: string, file: File) => {
    const formData = new FormData();
    formData.append('model', file);

    const response = await api.put(`/product/${productId}/3d-model`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        }
    });

    return response;
};

export const deleteProduct3DModel = async (productId: string) => {
    const response = await api.delete(`/product/${productId}/3d-model`);

    return response;
};

export const listPublic3DModelProducts = async (query: string) => {
    const response = await api.get(`/public/3d-models?query=${query}`);

    return response;
};
