import { api } from "./api";
const token = localStorage.getItem("token")?.replace(/"/g, '');

export const listAdmins = async () => {
	const response = await api.get("/admins/all", {
		headers: {
			Authorization: `${token}`,
		}
	});

	return response;
};

export const createAdmin = async ({
	first_name,
	last_name,
	phone_number,
	}: any) => {
		const response = await api.post("/admin", {
		first_name,
		last_name,
		phone_number,
		headers: {
			Authorization: `${token}`,
		}
	});

	return response;
};

export const updateAdmin = async({
	id,
	first_name,
	last_name,
	phone_number,
	}: any) => {
		const response = await api.put(`/admin/${id}`, {
		id,
		first_name,
		last_name,
		phone_number,
		headers: {
			Authorization: `${token}`,
		}
	});

	return response;
};
