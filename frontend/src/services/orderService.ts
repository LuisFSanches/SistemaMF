import { api } from "./api";
const token = localStorage.getItem("token")?.replace(/"/g, '');

export const createOrder = async ({
  admin_id,
  clientId,
  phone_number,
  first_name,
  last_name,
  addressId,
  street,
  street_number,
  complement,
  neighborhood,
  city,
  state,
  postal_code,
  country,
  description,
  additional_information,
  products_value,
  delivery_fee,
  total,
  status,
  has_card,
}: any) => {
  const response = await api.post("/order", {
      admin_id,
			clientId,
			first_name,
			last_name,
			phone_number,
			addressId,
			street,
			street_number,
			complement,
			neighborhood,
			city,
			state,
			postal_code,
			country,
			description,
			additional_information,
			products_value,
			delivery_fee,
			total,
			status,
			has_card,
    headers: {
      Authorization: `${token}`,
    }
  });
  
  return response;
};

export const getOnGoingOrders = async () => {
  const response = await api.get("/order/ongoing", {
    headers: {
      Authorization: `${token}`,
    }
  });
  
  return response;
};

export const getAllOrders = async () => {
  const response = await api.get("/order/all", {
    headers: {
      Authorization: `${token}`,
    }
  });
  
  return response;
}

export const updateStatus = async({
  id,
  status
}: any) => {
  const response = await api.patch(`/order/${id}`, {
    id,
    status,
    headers: {
      Authorization: `${token}`,
    }
  });
  
  return response;
};
