export interface IAdmin {
  id?: string;
  name: string;
  username: string;
  password?: string;
  role: string;
  super_admin_password?: string;
}
