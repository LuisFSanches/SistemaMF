import { api } from "./api";

export interface ICarouselCreateData {
    store_id: string;
    name: string;
    is_active?: boolean;
    product_ids: string[];
}

export interface ICarouselUpdateData {
    name?: string;
    is_active?: boolean;
    product_ids?: string[];
}

export const createCarousel = async (data: ICarouselCreateData) => {
    const response = await api.post("/store-carousel", data);
    return response.data;
};

export const listCarousels = async (storeId: string) => {
    const response = await api.get(`/store-carousel/all?store_id=${storeId}`);
    return response.data;
};

export const getCarouselById = async (id: string) => {
    const response = await api.get(`/store-carousel/${id}`);
    return response.data;
};

export const updateCarousel = async (id: string, data: ICarouselUpdateData) => {
    const response = await api.put(`/store-carousel/${id}`, data);
    return response.data;
};

export const deleteCarousel = async (id: string) => {
    const response = await api.delete(`/store-carousel/${id}`);
    return response.data;
};

export const listStorefrontCarousels = async (slug: string) => {
    const response = await api.get(`/storefront/${slug}/carousels`);
    return response.data;
};
