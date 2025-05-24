import { api } from "./api";
const token = localStorage.getItem("token")?.replace(/"/g, '');

export const getClientAddresses = async (params = "") => {

  const response = await api.get(`/address/${params}`);
  
  return response;
};

export const getPickupAddress = async () => {
  const response = await api.get(`/address/pickup`, {
    headers: {
      Authorization: `${token}`,
    }
  });
  
  return response;
};