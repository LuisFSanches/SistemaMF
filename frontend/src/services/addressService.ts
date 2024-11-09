import { api } from "./api";


export const getClientAddresses = async (params = "") => {
  const token = localStorage.getItem("token")?.replace(/"/g, '');

  const response = await api.get(`/address/${params}`, {
    headers: {
      Authorization: `${token}`,
    }
  });
  
  return response;
};
