export interface IUpdateMultipleOrderDeliveries {
    ids: string[]
    delivery_man_id?: string
    delivery_date?: Date
    is_paid?: boolean
    is_archived?: boolean
}
