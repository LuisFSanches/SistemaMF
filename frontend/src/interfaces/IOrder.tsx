import { IAddress } from "./IAddress";
import { IClient } from "./IClient";

export interface IOrder {
  id?: string;
  code: string;
  description: string;
  additional_information: string;
  client: IClient;
  clientAddress: IAddress;
  delivery_fee: number;
  has_card: false;
  status: string;
  products_value: number;
  total: number;
}
