import { IAddress } from "./IAddress";
import { IClient } from "./IClient";
import { Status } from "./IStatus";

export interface IOrder {
  id?: string;
  code: string;
  description: string;
  additional_information: string;
  client: IClient;
  clientAddress: IAddress;
  delivery_fee: number;
  has_card: false;
  status: Status;
  products_value: number;
  total: number;
}
