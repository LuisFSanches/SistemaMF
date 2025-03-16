export interface IOnlineOrder {
    id: string;
    client_id: string;
    client_address_id: string;
    type_of_delivery: string;
    pickup_on_store: boolean;
    receiver_name?: string;
    receiver_phone?: string;
    delivery_date: Date;
    status: string;
    has_card: boolean;
    online_code: string;
}
