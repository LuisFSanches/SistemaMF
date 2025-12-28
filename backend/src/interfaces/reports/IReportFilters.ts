export interface IReportFilters {
    start_date?: string | Date
    end_date?: string | Date
    status?: string
    payment_method?: string
    client_id?: string
    product_id?: string
    supplier_id?: string
    delivery_man_id?: string
    online_order?: boolean
    store_front_order?: boolean
    payment_received?: boolean
    limit?: number
    offset?: number
}

export interface ISalesReportResponse {
    total_orders: number
    total_revenue: number
    total_products_sold: number
    total_delivery_fees: number
    total_discounts: number
    average_ticket: number
    orders_by_status: {
        status: string
        count: number
        total_value: number
    }[]
    orders_by_payment_method: {
        payment_method: string
        count: number
        total_value: number
    }[]
    daily_sales: {
        date: string
        orders_count: number
        total_value: number
    }[]
}

export interface ITopProductsResponse {
    id: string
    name: string
    total_quantity: number
    total_revenue: number
    order_count: number
    average_price: number
}

export interface ITopClientsResponse {
    id: string
    first_name: string
    last_name: string
    phone_number: string
    total_orders: number
    total_spent: number
    average_order_value: number
    last_order_date: Date
}

export interface IStockReportResponse {
    id: string
    name: string
    current_stock: number
    unity: string
    total_purchased: number
    total_sold: number
    total_invested: number
    average_purchase_price: number
    current_value: number
    stock_status: 'low' | 'medium' | 'high'
}

export interface IFinancialReportResponse {
    period_start: string
    period_end: string
    total_revenue: number
    total_costs: number
    gross_profit: number
    total_orders: number
    total_orders_paid: number
    total_orders_pending: number
    pending_amount: number
    paid_amount: number
    total_discounts: number
    total_delivery_fees: number
    breakdown_by_payment_method: {
        payment_method: string
        count: number
        total: number
    }[]
}

export interface IDeliveryReportResponse {
    total_deliveries: number
    deliveries_paid: number
    deliveries_pending: number
    total_paid_value: number
    total_pending_value: number
    deliveries_by_man: {
        id: string
        name: string
        phone_number: string
        total_deliveries: number
        paid_deliveries: number
        pending_deliveries: number
        total_value: number
    }[]
}

export interface ISupplierReportResponse {
    id: string
    name: string
    total_transactions: number
    total_invested: number
    total_products_purchased: number
    average_purchase_value: number
    last_purchase_date: Date
}
