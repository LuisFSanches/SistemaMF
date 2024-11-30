import { api } from "./api";
const token = localStorage.getItem("token")?.replace(/"/g, '');

export const getClientAddresses = async (params = "") => {

  const response = await api.get(`/address/${params}`, {
    headers: {
      Authorization: `${token}`,
    }
  });
  
  return response;
};

export const getPickupAddress = async () => {
  const response = await api.get(`/address/pickup`, {
    headers: {
      Authorization: `${token}`,
    }
  });
  
  console.log('response', response)

  return response;
};