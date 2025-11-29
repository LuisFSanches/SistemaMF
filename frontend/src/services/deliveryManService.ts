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

export const getDeliveryManDetails = async (id: string) => {
    const response = await api.get(`/deliveryMan/${id}`, {
        headers: {
            Authorization: `${token}`,
        }
    });
    
    return response;
};

export const getDeliveryManByPhoneNumber = async (phone_number: string) => {
    console.log('phone_number', phone_number);
    const response = await api.get(`/deliveryMan/phone_number?phone_number=${phone_number}`);

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
