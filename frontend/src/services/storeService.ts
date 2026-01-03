import { api } from "./api";

interface ICreateStoreData {
    name: string;
    slug: string;
    cnpj?: string;
    phone_number: string;
    email: string;
    description?: string;
    is_active?: boolean;
}

interface IUpdateStoreData {
    name?: string;
    phone_number?: string;
    email?: string;
    description?: string;
    is_active?: boolean;
    is_first_access?: boolean;
}

interface IUpdateCredentialsData {
    mp_access_token?: string;
    mp_public_key?: string;
    mp_seller_id?: string;
    mp_webhook_secret?: string;
    inter_client_id?: string;
    inter_client_secret?: string;
    inter_api_cert_path?: string;
    inter_api_key_path?: string;
    payment_enabled?: boolean;
}

export const createStore = async (data: ICreateStoreData) => {
    const response = await api.post("/store", data);
    return response.data;
};

export const getStoreById = async (id: string) => {
    const response = await api.get(`/store/${id}`);
    return response.data;
};

export const getStoreBySlug = async (slug: string) => {
    const response = await api.get(`/store/any?slug=${slug}`);
    return response.data;
};

export const getAllStores = async () => {
    const response = await api.get("/store/all");
    return response.data;
};

export const updateStore = async (id: string, data: IUpdateStoreData) => {
    const response = await api.put(`/store/${id}`, data);
    return response.data;
};

export const updateStoreCredentials = async (id: string, data: IUpdateCredentialsData) => {
    const response = await api.put(`/store/${id}/credentials`, data);
    return response.data;
};

export const uploadStoreLogo = async (id: string, file: File) => {
    const formData = new FormData();
    formData.append('logo', file);
    
    const response = await api.post(`/store/${id}/logo`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
    return response.data;
};

export const uploadStoreBanner = async (id: string, file: File) => {
    const formData = new FormData();
    formData.append('banner', file);
    
    const response = await api.post(`/store/${id}/banner`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
    return response.data;
};

export const deleteStore = async (id: string) => {
    const response = await api.delete(`/store/${id}`);
    return response.data;
};
