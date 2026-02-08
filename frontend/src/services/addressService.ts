import { api } from "./api";

export const getClientAddresses = async (params = "") => {

  const response = await api.get(`/address/${params}`);
  
  return response;
};

export const getPickupAddress = async () => {
  const response = await api.get(`/address/pickup`);
  
  return response;
};