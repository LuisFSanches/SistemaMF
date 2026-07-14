export enum CouponStatus {
    ACTIVE = "ACTIVE",
    DISABLED = "DISABLED",
    NOT_STARTED = "NOT_STARTED",
    EXPIRED = "EXPIRED",
    USAGE_LIMIT_REACHED = "USAGE_LIMIT_REACHED"
}

export interface ICoupon {
    id: string;
    store_id: string;
    code: string;
    is_active: boolean;
    discount_type: "FIXED" | "PERCENTAGE";
    discount_value: number;
    max_discount_amount?: number | null;
    start_date: string | Date;
    expiration_date: string | Date;
    total_usage_limit?: number | null;
    usage_limit_per_customer?: number | null;
    current_usage_count: number;
    specific_customer_id?: string | null;
    minimum_order_amount?: number | null;
    created_at?: string | Date;
    updated_at?: string | Date;
    computedStatus?: CouponStatus;
    customer?: {
        id: string;
        first_name: string;
        last_name: string;
        email?: string;
    };
}

export interface ICouponUsageHistory {
    id: string;
    coupon_id: string;
    customer_id: string;
    order_id: string;
    discount_amount: number;
    used_at: string | Date;
    customer: {
        id: string;
        first_name: string;
        last_name: string;
        email?: string;
    };
    order: {
        id: string;
        code: number;
        total: number;
        created_at: string | Date;
    };
}

export interface ICreateCouponData {
    code: string;
    is_active?: boolean;
    discount_type: "FIXED" | "PERCENTAGE";
    discount_value: number;
    max_discount_amount?: number | null;
    start_date: Date;
    expiration_date: Date;
    total_usage_limit?: number | null;
    usage_limit_per_customer?: number | null;
    specific_customer_id?: string | null;
    minimum_order_amount?: number | null;
}

export interface IValidationResult {
    valid: boolean;
    discount_amount?: number;
    error_code?: string;
    error_message?: string;
    coupon?: {
        id: string;
        code: string;
        discount_type: string;
        discount_value: number;
    };
}
