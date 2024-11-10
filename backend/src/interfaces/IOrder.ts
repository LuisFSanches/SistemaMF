export interface IOrder {
  id?: string;
  description: string;
  additional_information: string;
  client_id: string;
  client_address_id: string;
  products_value: number;
  delivery_fee: number;
  total: number;
  created_by: string;
  updated_by: string;
  status: string;
  has_card: boolean;
}
