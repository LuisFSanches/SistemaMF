import { api } from "./api";

export const createUser = async (username: string, password: string) => {
  const response = await api.post("/user/create", {
    username,
    password,
  });
  return response;
};

export const getUserData = async () => {
  const response = await api.get("/user");
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
