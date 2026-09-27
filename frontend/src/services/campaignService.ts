import { api } from "./api";
import { ICreateCampaignData } from "../interfaces/campaign";

export const createCampaign = async (data: ICreateCampaignData) => {
    const response = await api.post("/admin/campaigns", data);
    return response;
};

export const listCampaigns = async (page?: number, limit?: number) => {
    const params = new URLSearchParams();
    if (page) params.append("page", page.toString());
    if (limit) params.append("limit", limit.toString());

    const response = await api.get(`/admin/campaigns?${params.toString()}`);
    return response;
};

export const getCampaignDetails = async (id: string) => {
    const response = await api.get(`/admin/campaigns/${id}`);
    return response;
};

export const dispatchCampaign = async (id: string) => {
    const response = await api.post(`/admin/campaigns/${id}/dispatch`);
    return response;
};

export const deleteCampaign = async (id: string) => {
    const response = await api.delete(`/admin/campaigns/${id}`);
    return response;
};
