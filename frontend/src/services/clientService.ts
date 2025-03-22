import { api } from "./api";
const token = localStorage.getItem("token")?.replace(/"/g, '');

export const getClientByPhone = async (params = "") => {
  const response = await api.get(`/client/phone_number?phone_number=${params}`, {
    headers: {
      Authorization: `${token}`,
    }
  });
  
  return response;
};


export const listClients = async (page: number, pageSize: number) => {
  const response = await api.get(`/clients/all?page=${page}&pageSize=${pageSize}`, {
    headers: {
      Authorization: `${token}`,
    }
  });
  
  return response;
};

export const createClient = async ({
  first_name,
  last_name,
  phone_number,
}: any) => {
  const response = await api.post("/client", {
    first_name,
    last_name,
    phone_number,
    headers: {
      Authorization: `${token}`,
    }
  });
  
  return response;
};

export const updateClient = async({
  id,
  first_name,
  last_name,
  phone_number,
}: any) => {
  const response = await api.put(`/client/${id}`, {
    id,
    first_name,
    last_name,
    phone_number,
    headers: {
      Authorization: `${token}`,
    }
  });
  
  return response;
};
