import { api } from "./api";
import { ICreateWhatsAppTemplateData } from "../interfaces/whatsappTemplate";

export const createWhatsAppTemplate = async (data: ICreateWhatsAppTemplateData) => {
    const response = await api.post("/admin/whatsapp-templates", data);
    return response;
};

export const listWhatsAppTemplates = async () => {
    const response = await api.get("/admin/whatsapp-templates");
    return response;
};

export const updateWhatsAppTemplate = async (id: string, data: Partial<ICreateWhatsAppTemplateData>) => {
    const response = await api.put(`/admin/whatsapp-templates/${id}`, data);
    return response;
};

export const deleteWhatsAppTemplate = async (id: string) => {
    const response = await api.delete(`/admin/whatsapp-templates/${id}`);
    return response;
};

export const uploadWhatsAppTemplateHeaderMedia = async (id: string, file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post(`/admin/whatsapp-templates/${id}/header-media`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response;
};

export const uploadWhatsAppTemplatePreviewImage = async (id: string, file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post(`/admin/whatsapp-templates/${id}/preview-image`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response;
};
