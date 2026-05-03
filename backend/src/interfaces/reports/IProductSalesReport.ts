export interface IProductSalesReportFilters {
    start_date?: string | Date
    end_date?: string | Date
    product_name?: string
    category_id?: string
    page?: number
    pageSize?: number
}

export interface IProductSalesReportItem {
    id: string
    name: string
    image: string | null
    quantity_sold: number
}

export interface IProductSalesReportResponse {
    data: IProductSalesReportItem[]
    total: number
    currentPage: number
    totalPages: number
}
