import { api, getStoreId } from "./api";

export const listAdmins = async () => {
	const response = await api.get("/admins/all");

	return response;
};

export const createAdmin = async ({
	name,
	username,
	password,
	role,
	super_admin_password
	}: any) => {
		const store_id = getStoreId();
		const response = await api.post("/admin", {
		store_id,
		name,
		username,
		password,
		role,
		super_admin_password,
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
	});

	return response;
};
