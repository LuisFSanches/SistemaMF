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

// Solicitar reset de senha (Esqueci minha senha)
export const requestPasswordReset = async (email: string) => {
	const response = await api.post("/admin/password/request-reset", {
		email,
	});

	return response;
};

// Confirmar reset de senha (Via link do email)
export const resetPassword = async (token: string, new_password: string) => {
	const response = await api.post("/admin/password/reset", {
		token,
		new_password,
	});

	return response;
};

// Atualizar email do admin (requer senha atual)
export const updateAdminEmail = async (email: string, current_password: string) => {
	const response = await api.put("/admin/email/update", {
		email,
		current_password,
	});

	return response;
};

// Reset de senha por email (SUPER_ADMIN apenas)
export const resetPasswordByEmail = async (email: string, new_password: string) => {
	const response = await api.put("/admin/password/reset-by-email", {
		email,
		new_password,
	});

	return response;
};

// SYS_ADMIN: Listar todas as lojas
export const listAllStores = async () => {
	const response = await api.get("/admin/stores/all");
	return response;
};

// SYS_ADMIN: Alternar para uma loja específica
export const switchStore = async (store_id: string) => {
	const response = await api.post("/admin/switch-store", {
		store_id,
	});
	return response;
};
