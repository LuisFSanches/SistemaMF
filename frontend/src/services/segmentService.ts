import { api } from "./api";
import { ICreateSegmentData, ISegmentCriteria, SegmentType } from "../interfaces/segment";

export const createSegment = async (data: ICreateSegmentData) => {
    const response = await api.post("/admin/segments", data);
    return response;
};

export const listSegments = async (page?: number, limit?: number) => {
    const params = new URLSearchParams();
    if (page) params.append("page", page.toString());
    if (limit) params.append("limit", limit.toString());

    const response = await api.get(`/admin/segments?${params.toString()}`);
    return response;
};

export const getSegmentDetails = async (id: string) => {
    const response = await api.get(`/admin/segments/${id}`);
    return response;
};

export const updateSegment = async (id: string, data: Partial<ICreateSegmentData>) => {
    const response = await api.put(`/admin/segments/${id}`, data);
    return response;
};

export const deleteSegment = async (id: string) => {
    const response = await api.delete(`/admin/segments/${id}`);
    return response;
};

export const previewSegment = async (id: string, page?: number, limit?: number) => {
    const params = new URLSearchParams();
    if (page) params.append("page", page.toString());
    if (limit) params.append("limit", limit.toString());

    const response = await api.get(`/admin/segments/${id}/preview?${params.toString()}`);
    return response;
};

export const previewSegmentDraft = async (data: {
    type: SegmentType;
    criteria?: ISegmentCriteria;
    client_ids?: string[];
    page?: number;
    limit?: number;
}) => {
    const response = await api.post("/admin/segments/preview", data);
    return response;
};
