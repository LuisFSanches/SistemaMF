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
	name,
	username,
	password,
	role,
	super_admin_password
	}: any) => {
		const response = await api.post("/admin", {
		name,
		username,
		password,
		role,
		super_admin_password,
		headers: {
			Authorization: `${token}`,
		}
	});

	return response;
};

export const updateAdmin = async({
	id,
	name,
	username,
	password,
	role,
	super_admin_password
	}: any) => {
		const response = await api.put(`/admin/${id}`, {
		id,
		name,
		username,
		password,
		role,
		super_admin_password,
		headers: {
			Authorization: `${token}`,
		}
	});

	return response;
};
