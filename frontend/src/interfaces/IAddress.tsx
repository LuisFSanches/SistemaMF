export interface IAddress {
  id?: string;
  client_id: string;
  street: string;
  street_number: string;
  complement: string;
  neighborhood: string;
  reference_point?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
}
