import { api, getStoreId } from "./api";

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
	store_front_order,
	online_code,
	products,
	is_delivery,
	card_from,
	card_to,
	card_message,
	store_id: receivedStoreId,
	order_email
}: any) => {
	// Usar store_id recebido (do storefront) ou obter do admin logado
	const store_id = receivedStoreId || getStoreId();
	console.log('[orderService] Store ID usado:', store_id, '(recebido:', receivedStoreId, ', admin:', getStoreId(), ')');
	
	const response = await api.post("/order", {
		store_id,  // Adicionar store_id automaticamente
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
		store_front_order,
		online_code,
		products,
		is_delivery,
		card_from,
		card_to,
		card_message,
		order_email
	});

	return response;
};

export const createOrderByAi = async (data: any) => {
	const store_id = getStoreId();
	const response = await api.post("/order/ai", { ...data, store_id });

	return response;
}

export const getCompletedOrder = async (id: string) => {
	const response = api.get(`/order/completedOrder/${id}`);

	return response;
}


export const getOrderById = async(id: string) => {
	const response = await api.get(`/order/detail/${id}`);

	return response;
};

export const getOnGoingOrders = async () => {
	const response = await api.get("/order/ongoing");

	return response;
};

export const getAllOrders = async (page: number, pageSize: number, query: string, startDate?: string | null, endDate?: string | null) => {
	let url = `/order/all?page=${page}&pageSize=${pageSize}&query=${query}`;
	
	if (startDate) {
		url += `&startDate=${startDate}`;
	}
	
	if (endDate) {
		url += `&endDate=${endDate}`;
	}
	
	const response = await api.get(url);

	return response;
}

export const getWaitingOrders = async () => {
	const response = await api.get("/order/waitingForClient");

	return response;
}

export const updateStatus = async({
	id,
	status
}: any) => {
	const response = await api.patch(`/order/${id}`, {
		id,
		status
	});

	return response;
};

export const updateOrder = async(order: any) => {
	const response = await api.put(`/order/${order.id}`, {
		order
	});

	return response;
};

export const updateOrderPaymentStatus = async(id: string, payment_received: boolean) => {
	const response = await api.patch(`/order/${id}/payment`, {
		payment_received
	});

	return response.data;
};

export const finishOnlineOrder = async(order: any) => {
	const response = await api.put(`/order/finish/${order.id}`, {
		order,
	});

	return response;
};

export const deleteOrder = async(id: string) => {
	const response = await api.delete(`/order/${id}`);

	return response;
};
