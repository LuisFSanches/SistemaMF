import { api } from "./api";
import { ICreateOrderToReceive, IUpdateOrderToReceive } from "../interfaces/IOrderToReceive";

export const createOrderToReceive = async (data: ICreateOrderToReceive) => {
  const response = await api.post("/orderToReceive", data);
  return response.data;
};

export const getAllOrdersToReceive = async (page: number, pageSize: number, query: string, filter?: string) => {
  let url = `/orderToReceive/all?page=${page}&pageSize=${pageSize}&query=${query}`;
  
  if (filter && filter !== 'all') {
    url += `&filter=${filter}`;
  }
  
  const response = await api.get(url);
  return response.data;
};

export const getOrderToReceiveById = async (id: string) => {
  const response = await api.get(`/orderToReceive/${id}`);
  return response.data;
};

export const checkOrderToReceiveExists = async (orderId: string) => {
  try {
    const response = await api.get(`/orderToReceive/check/${orderId}`);
    return response.data !== null;
  } catch (error: any) {
    if (error.response?.status === 404) {
      return false;
    }
    throw error;
  }
};

export const updateOrderToReceive = async (id: string, data: IUpdateOrderToReceive) => {
  const response = await api.put(`/orderToReceive/${id}`, data);
  return response.data;
};

export const deleteOrderToReceive = async (id: string) => {
  const response = await api.delete(`/orderToReceive/${id}`);
  return response.data;
};
