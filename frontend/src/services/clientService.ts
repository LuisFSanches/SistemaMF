import { api } from "./api";


export const getClientByPhone = async (params = "") => {
  const token = localStorage.getItem("token")?.replace(/"/g, '');

  const response = await api.get(`/client/phone_number?phone_number=${params}`, {
    headers: {
      Authorization: `${token}`,
    }
  });
  
  return response;
};


export const listClients = async () => {
  const token = localStorage.getItem("token")?.replace(/"/g, '');

  const response = await api.get("/clients/all", {
    headers: {
      Authorization: `${token}`,
    }
  });
  
  return response;
};
