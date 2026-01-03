export interface IAdmin {
    id?: string;
    username: string;
    name: string;
    password: string;
    role: string;
    super_admin_password?: string;
    store_id?: string;
}
