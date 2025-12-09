import { api } from "./api";
const token = localStorage.getItem("token")?.replace(/"/g, '');

export const listDeliveryMen = async (page: number, pageSize: number, query: string) => {
    const response = await api.get(`/deliveryMan/all?page=${page}&pageSize=${pageSize}&query=${query}`, {
        headers: {
            Authorization: `${token}`,
        }
    });
    
    return response;
};

export const getDeliveryManDetails = async (id: string, page?: number, pageSize?: number, startDate?: string | null, endDate?: string | null) => {
    let url = `/deliveryMan/${id}`;
    
    const params = new URLSearchParams();
    if (page) params.append('page', page.toString());
    if (pageSize) params.append('pageSize', pageSize.toString());
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    
    if (params.toString()) {
        url += `?${params.toString()}`;
    }
    
    const response = await api.get(url, {
        headers: {
            Authorization: `${token}`,
        }
    });
    
    return response;
};

export const getDeliveryManByPhoneCode = async (phone_code: string) => {
    console.log('phone_code', phone_code);
    const response = await api.get(`/deliveryMan/phone_code?phone_code=${phone_code}`);

    return response;
};

export const createDeliveryMan = async ({
    name,
    phone_number,
}: any) => {
    const response = await api.post("/deliveryMan", {
        name,
        phone_number,
    }, {
        headers: {
            Authorization: `${token}`,
        }
    });
    
    return response;
};

export const updateDeliveryMan = async ({
    id,
    name,
    phone_number,
}: any) => {
    const response = await api.put(`/deliveryMan/${id}`, {
        name,
        phone_number,
    }, {
        headers: {
            Authorization: `${token}`,
        }
    });
    
    return response;
};

export const deleteDeliveryMan = async (id: string) => {
    const response = await api.delete(`/deliveryMan/${id}`, {
        headers: {
            Authorization: `${token}`,
        }
    });
    
    return response;
};
