export interface IOrderDetails {
    orderInfo: {
        code: number
        description: string
        additional_information: string | null
        delivery_date: Date
        status: string
        is_delivery: boolean
        online_order: boolean
        store_front_order: boolean
    }
    orderValues: {
        products_value: number
        discount: number
        delivery_fee: number
        total: number
        payment_method: string | null
        payment_received: boolean
    }
    cardDetails: {
        card_from: string | null
        card_to: string | null
        card_message: string | null
    } | null
    clientInfo: {
        id: string
        first_name: string
        last_name: string
        phone_number: string
        address: {
            street: string
            street_number: string
            complement: string | null
            neighborhood: string
            reference_point: string | null
            city: string
            state: string
            postal_code: string | null
        }
    }
    deliveryManInfo: {
        id: string
        name: string
        phone_number: string
    } | null
    createdBy: {
        id: string
        name: string
        username: string
    } | null
    orderItems: any[]
}
