export interface IOrderAI {
    delivery_date: string;
    card_from: string;
    card_to: string;
    first_name: string;
    last_name: string;
    phone_number: string;
    receiver_name: string;
    receiver_phone: string;
    street: string;
    neighborhood: string;
    street_number: string;
    reference: string;
    city: string;
    state: string;
    postal_code: string;
    card_message: string;
    has_card: boolean;
    is_delivery: boolean;
    pickup_on_store: boolean;
}
