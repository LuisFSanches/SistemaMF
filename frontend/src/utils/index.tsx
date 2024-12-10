export const rawTelephone = (phoneNumber: string,) => {
  const numericValue = phoneNumber?.replace(/[^0-9]/g, "");
  return numericValue;
};

export const convertMoney = (value: number) => {
  const numericValue = typeof value === "string" ? parseFloat(value) : value
  const formatedValue = numericValue.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  return formatedValue
};