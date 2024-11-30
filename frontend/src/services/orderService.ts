import { api } from "./api";
const token = localStorage.getItem("token")?.replace(/"/g, '');

export const createOrder = async ({
	clientId,
	phone_number,
	first_name,
	last_name,
	receiver_name,
	receiver_phone,
	addressId,
	pickup_on_store,
	street,
	street_number,
	complement,
	reference_point,
	neighborhood,
	city,
	state,
	postal_code,
	country,
	description,
	additional_information,
	delivery_date,
	payment_method,
	payment_received,
	products_value,
	delivery_fee,
	total,
	status,
	has_card,
}: any) => {

	const response = await api.post("/order", {
		clientId,
		first_name,
		last_name,
		phone_number,
		receiver_name,
		receiver_phone,
		addressId,
		pickup_on_store: true,
		street,
		street_number,
		complement,
		reference_point,
		neighborhood,
		city,
		state,
		postal_code,
		country,
		description,
		additional_information,
		delivery_date,
		products_value,
		delivery_fee,
		total,
		payment_method,
		payment_received,
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

export const updateOrder = async(order: any) => {
	const response = await api.put(`/order/${order.id}`, {
		order,
		headers: {
			Authorization: `${token}`,
		}
	});

	return response;
};
