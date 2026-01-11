import { IOrder } from "./IOrder";
import { IDeliveryMan } from "./IDeliveryMan";

export interface IOrderDelivery {
    id: string;
    order_id: string;
    delivery_man_id: string;
    delivery_date: string;
    is_paid: boolean;
    is_archived: boolean;
    created_at: string;
    updated_at: string;
    order?: IOrder;
    deliveryMan?: IDeliveryMan;
}

export interface ICreateOrderDelivery {
    order_id: string;
    delivery_man_id: string;
    delivery_date: string;
    store_id?: string;
    is_paid?: boolean;
    is_archived?: boolean;
}

export interface IUpdateOrderDelivery {
    order_id?: string;
    delivery_man_id?: string;
    delivery_date?: string;
    is_paid?: boolean;
    is_archived?: boolean;
}
