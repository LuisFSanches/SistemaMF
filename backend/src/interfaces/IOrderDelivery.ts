export interface IOrderDelivery {
    id?: string
    order_id: string
    delivery_man_id: string
    delivery_date: Date
    is_paid?: boolean
    is_archived?: boolean
    created_at?: Date
    updated_at?: Date
}
