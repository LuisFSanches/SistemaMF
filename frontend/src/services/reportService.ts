import { api } from "./api";

export interface IReportFilters {
    start_date?: string;
    end_date?: string;
    status?: string;
    payment_method?: string;
    client_id?: string;
    online_order?: boolean;
    store_front_order?: boolean;
    payment_received?: boolean;
    delivery_man_id?: string;
    supplier_id?: string;
}

export interface ISalesReport {
    total_orders: number;
    total_revenue: number;
    total_products_sold: number;
    total_delivery_fees: number;
    total_discounts: number;
    average_ticket: number;
    orders_by_status: Array<{
        status: string;
        count: number;
        total_value: number;
    }>;
    orders_by_payment_method: Array<{
        payment_method: string;
        count: number;
        total_value: number;
    }>;
    daily_sales: Array<{
        date: string;
        orders_count: number;
        total_value: number;
    }>;
}

export interface ITopProduct {
    id: string;
    name: string;
    total_quantity: number;
    total_revenue: number;
    order_count: number;
    average_price: number;
}

export interface ITopClient {
    id: string;
    first_name: string;
    last_name: string;
    phone_number: string;
    total_orders: number;
    total_spent: number;
    average_order_value: number;
    last_order_date: Date;
}

export interface IStockReport {
    id: string;
    name: string;
    current_stock: number;
    unity: string;
    total_purchased: number;
    total_sold: number;
    total_invested: number;
    average_purchase_price: number;
    current_value: number;
    stock_status: 'low' | 'medium' | 'high';
}

export interface IFinancialReport {
    period_start: string;
    period_end: string;
    total_revenue: number;
    total_costs: number;
    gross_profit: number;
    total_orders: number;
    total_orders_paid: number;
    total_orders_pending: number;
    pending_amount: number;
    paid_amount: number;
    total_discounts: number;
    total_delivery_fees: number;
    breakdown_by_payment_method: Array<{
        payment_method: string;
        count: number;
        total: number;
    }>;
}

export interface IDeliveryReport {
    total_deliveries: number;
    deliveries_paid: number;
    deliveries_pending: number;
    total_paid_value: number;
    total_pending_value: number;
    deliveries_by_man: Array<{
        id: string;
        name: string;
        phone_number: string;
        total_deliveries: number;
        paid_deliveries: number;
        pending_deliveries: number;
        total_value: number;
    }>;
}

export interface ISupplierReport {
    id: string;
    name: string;
    total_transactions: number;
    total_invested: number;
    total_products_purchased: number;
    average_purchase_value: number;
    last_purchase_date: Date;
}

export async function getSalesReport(filters?: IReportFilters) {
    const params = new URLSearchParams();
    
    if (filters?.start_date) params.append('start_date', filters.start_date);
    if (filters?.end_date) params.append('end_date', filters.end_date);
    if (filters?.status) params.append('status', filters.status);
    if (filters?.payment_method) params.append('payment_method', filters.payment_method);
    if (filters?.client_id) params.append('client_id', filters.client_id);
    if (filters?.online_order !== undefined) params.append('online_order', String(filters.online_order));
    if (filters?.store_front_order !== undefined) params.append('store_front_order', String(filters.store_front_order));
    if (filters?.payment_received !== undefined) params.append('payment_received', String(filters.payment_received));

    return api.get<ISalesReport>(`/reports/sales?${params.toString()}`);
}

export async function getTopProducts(filters?: IReportFilters) {
    const params = new URLSearchParams();
    
    if (filters?.start_date) params.append('start_date', filters.start_date);
    if (filters?.end_date) params.append('end_date', filters.end_date);

    return api.get<ITopProduct[]>(`/reports/products/top?${params.toString()}`);
}

export async function getTopClients(filters?: IReportFilters) {
    const params = new URLSearchParams();
    
    if (filters?.start_date) params.append('start_date', filters.start_date);
    if (filters?.end_date) params.append('end_date', filters.end_date);

    return api.get<ITopClient[]>(`/reports/clients/top?${params.toString()}`);
}

export async function getStockReport() {
    return api.get<IStockReport[]>(`/reports/stock`);
}

export async function getFinancialReport(filters?: IReportFilters) {
    const params = new URLSearchParams();
    
    if (filters?.start_date) params.append('start_date', filters.start_date);
    if (filters?.end_date) params.append('end_date', filters.end_date);

    return api.get<IFinancialReport>(`/reports/financial?${params.toString()}`);
}

export async function getDeliveryReport(filters?: IReportFilters) {
    const params = new URLSearchParams();
    
    if (filters?.start_date) params.append('start_date', filters.start_date);
    if (filters?.end_date) params.append('end_date', filters.end_date);
    if (filters?.delivery_man_id) params.append('delivery_man_id', filters.delivery_man_id);

    return api.get<IDeliveryReport>(`/reports/delivery?${params.toString()}`);
}

export async function getSupplierReport(filters?: IReportFilters) {
    const params = new URLSearchParams();
    
    if (filters?.start_date) params.append('start_date', filters.start_date);
    if (filters?.end_date) params.append('end_date', filters.end_date);
    if (filters?.supplier_id) params.append('supplier_id', filters.supplier_id);

    return api.get<ISupplierReport[]>(`/reports/supplier?${params.toString()}`);
}
