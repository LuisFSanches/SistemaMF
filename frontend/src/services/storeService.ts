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
    cnpj?: string;
    slug?: string;
    phone_number?: string;
    email?: string;
    description?: string;
    is_active?: boolean;
    is_first_access?: boolean;
    facebook?: string;
    instagram?: string;
    youtube?: string;
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

interface IScheduleUpdate {
    day_of_week: string;
    is_closed: boolean;
    opening_time?: string;
    closing_time?: string;
    lunch_break_start?: string;
    lunch_break_end?: string;
}

interface IUpdateStoreSchedulesData {
    schedules: IScheduleUpdate[];
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

export const updateStoreSchedules = async (id: string, data: IUpdateStoreSchedulesData) => {
    const response = await api.put(`/store/${id}/schedules`, data);
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
