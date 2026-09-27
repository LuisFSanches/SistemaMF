export type SegmentType = "DYNAMIC" | "MANUAL";

export interface IPurchaseRecencyFilter {
    reference: "SPECIAL_DATE" | "FIXED_DATE";
    special_date_id?: string;
    fixed_date?: string | Date;
    days_before: number;
    days_after: number;
}

export interface ICategoryFilter {
    category_ids: string[];
}

export interface IMinOrderValueFilter {
    min_total: number;
}

export interface IMinOrderCountFilter {
    min_count: number;
}

export interface ISegmentCriteria {
    purchase_recency?: IPurchaseRecencyFilter;
    category?: ICategoryFilter;
    min_order_value?: IMinOrderValueFilter;
    min_order_count?: IMinOrderCountFilter;
}

export interface ISegmentClient {
    id: string;
    first_name: string;
    last_name: string;
    phone_number: string;
    country_code: string;
    email?: string | null;
}

export interface ISegment {
    id: string;
    store_id?: string | null;
    name: string;
    description?: string | null;
    type: SegmentType;
    criteria?: ISegmentCriteria | null;
    created_at?: string | Date;
    updated_at?: string | Date;
    _count?: {
        clients: number;
    };
    clients?: {
        client: ISegmentClient;
    }[];
}

export interface ICreateSegmentData {
    name: string;
    description?: string | null;
    type: SegmentType;
    criteria?: ISegmentCriteria;
    client_ids?: string[];
}

export interface ISegmentPreviewResult {
    clients: ISegmentClient[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}
