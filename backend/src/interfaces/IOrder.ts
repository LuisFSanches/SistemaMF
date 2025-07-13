export interface IOrder {
  id?: string;
  description: string;
  additional_information: string;
  client_id: string;
  client_address_id: string;
  pickup_on_store: boolean;
  receiver_name?: string;
  receiver_phone?: string;
  products_value: number;
  delivery_fee: number;
  total: number;
  payment_method: string;
  payment_received: boolean;
  delivery_date: string;
  created_by: string;
  updated_by: string;
  status: string;
  has_card: boolean;
  online_order: boolean;
  online_code?: string;
  products?: any,
  is_delivery?: boolean
}
