export interface IAdmin {
  id?: string;
  name: string;
  username: string;
  password?: string;
  role: string;
  email?: string;
  super_admin_password?: string;
  store_id?: string;
}
