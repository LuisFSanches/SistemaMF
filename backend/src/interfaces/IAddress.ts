export interface IAddress {
  id?: string;
  client_id: string;
  street: string;
  city: string;
  state: string;
  postal_code?: string;
  country: string;
}
