import { IOrder } from "./IOrder";

export interface IOrderToReceive {
  id?: string;
  order_id: string;
  payment_due_date: string;
  received_date?: string;
  type: string;
  is_archived: boolean;
  created_at?: string;
  updated_at?: string;
  order?: IOrder;
  totalToReceive?: number;
}

export interface ICreateOrderToReceive {
  order_id: string;
  payment_due_date: string;
  type: string;
}

export interface IUpdateOrderToReceive {
  payment_due_date?: string;
  type?: string;
  received_date?: string;
  is_archived?: boolean;
}
