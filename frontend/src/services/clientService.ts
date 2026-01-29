import { api } from "./api";

export const getClientByPhone = async (params = "") => {
  const response = await api.get(`/client/phone_number?phone_number=${params}`);
  
  return response;
};

export const getClientDetails = async (id: string) => {
  const response = await api.get(`/client/${id}`);
  
  return response;
}


export const listClients = async (page: number, pageSize: number, query: string) => {
  const response = await api.get(`/clients/all?page=${page}&pageSize=${pageSize}&query=${query}`);
  
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
  });
  
  return response;
};

export const createClientOnline = async ({
  first_name,
  last_name,
  phone_number,
}: any) => {
  const response = await api.post("/client/new/online", {
    first_name,
    last_name,
    phone_number,
  });
  
  return response;
}

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
  });
  
  return response;
};
