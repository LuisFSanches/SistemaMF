import { IAddress } from "./IAddress";
import { IClient } from "./IClient";
import { Status } from "./IStatus";

export interface IOrder {
  id?: string;
  code: string;
  description: string;
  additional_information: string;
  client_id?: string;
  client_address_id?: string;
  pickup_on_store: boolean;
  client: IClient;
  clientAddress: IAddress;
  receiver_name?: string;
  receiver_phone?: string;
  delivery_fee: number;
  products_value: number;
  total: number;
  payment_method: string;
  payment_received: boolean;
  delivery_date: string;
  status: Status;
  has_card: false;
}
