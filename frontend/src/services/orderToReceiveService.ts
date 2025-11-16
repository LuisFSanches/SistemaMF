import { api } from "./api";
import { ICreateOrderToReceive, IUpdateOrderToReceive } from "../interfaces/IOrderToReceive";

const token = localStorage.getItem("token")?.replace(/"/g, '');

export const createOrderToReceive = async (data: ICreateOrderToReceive) => {
  const response = await api.post("/orderToReceive", data, {
    headers: {
      authorization: token,
    },
  });
  return response.data;
};

export const getAllOrdersToReceive = async (page: number, pageSize: number, query: string, filter?: string) => {
  let url = `/orderToReceive/all?page=${page}&pageSize=${pageSize}&query=${query}`;
  
  if (filter && filter !== 'all') {
    url += `&filter=${filter}`;
  }
  
  const response = await api.get(url, {
    headers: {
      authorization: token,
    },
  });
  return response.data;
};

export const getOrderToReceiveById = async (id: string) => {
  const response = await api.get(`/orderToReceive/${id}`, {
    headers: {
      authorization: token,
    },
  });
  return response.data;
};

export const checkOrderToReceiveExists = async (orderId: string) => {
  try {
    const response = await api.get(`/orderToReceive/check/${orderId}`, {
      headers: {
        authorization: token,
      },
    });
    return response.data !== null;
  } catch (error: any) {
    if (error.response?.status === 404) {
      return false;
    }
    throw error;
  }
};

export const updateOrderToReceive = async (id: string, data: IUpdateOrderToReceive) => {
  const response = await api.put(`/orderToReceive/${id}`, data, {
    headers: {
      authorization: token,
    },
  });
  return response.data;
};

export const deleteOrderToReceive = async (id: string) => {
  const response = await api.delete(`/orderToReceive/${id}`, {
    headers: {
      authorization: token,
    },
  });
  return response.data;
};
