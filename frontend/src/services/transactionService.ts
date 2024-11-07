import { api } from "./api";

export const createTransaction = async (
  creditedAccountId: string,
  value: number
) => {
  const response = await api.post("/transaction/create", {
    creditedAccountId,
    value,
  });
  return response;
};

export const listTransaction = async (params = "") => {
  const response = await api.get(`/transaction/list?${params}`);

  return response;
};
