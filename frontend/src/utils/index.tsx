
export const rawTelephone = (phoneNumber: string,) => {
  const numericValue = phoneNumber.replace(/[^0-9]/g, "");
  return numericValue;
};
