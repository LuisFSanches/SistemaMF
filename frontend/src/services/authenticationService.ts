import { api } from "./api";

export const authenticateUser = async (username: string, password: string) => {
  const response = await api.post("/admins/login", {
    username,
    password,
  });
  return response;
};
