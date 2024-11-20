export interface IAddress {
  id?: string;
  client_id: string;
  street: string;
  street_number: string;
  complement: string;
  reference_point: string;
  neighborhood: string;
  city: string;
  state: string;
  postal_code?: string;
  country: string;
}
