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
	discount,
	delivery_fee,
	total,
	status,
	has_card,
	created_by,
	online_order,
	online_code,
	products,
	is_delivery
}: any) => {
	const response = await api.post("/order", {
		clientId,
		first_name,
		last_name,
		phone_number,
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
		products_value,
		discount,
		delivery_fee,
		total,
		payment_method,
		payment_received,
		status,
		has_card,
		created_by,
		online_order,
		online_code,
		products,
		is_delivery,
		headers: {
			Authorization: `${token}`,
		}
	});

	return response;
};

export const createOrderByAi = async (data: any) => {
	const response = await api.post("/order/ai", data);

	return response;
}

export const getOrder = async (id: string) => {
	const response = api.get(`/order/completedOrder/${id}`);

	return response;
}

export const getOnGoingOrders = async () => {
	const response = await api.get("/order/ongoing", {
		headers: {
			Authorization: `${token}`,
		}
	});

	return response;
};

export const getAllOrders = async (page: number, pageSize: number, query: string) => {
	const response = await api.get(`/order/all?page=${page}&pageSize=${pageSize}&query=${query}`, {
		headers: {
			Authorization: `${token}`,
		}
	});

	return response;
}

export const getWaitingOrders = async () => {
	const response = await api.get("/order/waitingForClient", {
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

export const finishOnlineOrder = async(order: any) => {
	const response = await api.put(`/order/finish/${order.id}`, {
		order,
	});

	return response;
};

export const deleteOrder = async(id: string) => {
	const response = await api.delete(`/order/${id}`, {
		headers: {
			Authorization: `${token}`,
		}
	});

	return response;
};
