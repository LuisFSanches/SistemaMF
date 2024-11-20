export interface IOrder {
  id?: string;
  description: string;
  additional_information: string;
  client_id: string;
  client_address_id: string;
  receiver_name?: string;
  receiver_phone?: string;
  products_value: number;
  delivery_fee: number;
  total: number;
  payment_method: string;
  payment_received: boolean;
  delivery_date: Date;
  created_by: string;
  updated_by: string;
  status: string;
  has_card: boolean;
}
