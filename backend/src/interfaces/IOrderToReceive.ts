export interface IOrderToReceive {
    id?: string
    order_id: string
    payment_due_date: Date
    received_date?: Date
    type: string
    is_archived?: boolean
    created_at?: Date
    updated_at?: Date
}
