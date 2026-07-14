export enum CouponStatus {
    ACTIVE = "ACTIVE",
    DISABLED = "DISABLED",
    NOT_STARTED = "NOT_STARTED",
    EXPIRED = "EXPIRED",
    USAGE_LIMIT_REACHED = "USAGE_LIMIT_REACHED"
}

export interface ICoupon {
    id: string;
    code: string;
    is_active: boolean;
    discount_type: string;
    discount_value: number;
    max_discount_amount?: number | null;
    start_date: Date;
    expiration_date: Date;
    total_usage_limit?: number | null;
    usage_limit_per_customer?: number | null;
    current_usage_count: number;
    specific_customer_id?: string | null;
    minimum_order_amount?: number | null;
    created_at?: Date;
    updated_at?: Date;
}

export function getCouponStatus(coupon: ICoupon): CouponStatus {
    const now = new Date();

    if (!coupon.is_active) {
        return CouponStatus.DISABLED;
    }

    if (now > coupon.expiration_date) {
        return CouponStatus.EXPIRED;
    }

    if (now < coupon.start_date) {
        return CouponStatus.NOT_STARTED;
    }

    if (
        coupon.total_usage_limit !== null &&
        coupon.total_usage_limit !== undefined &&
        coupon.current_usage_count >= coupon.total_usage_limit
    ) {
        return CouponStatus.USAGE_LIMIT_REACHED;
    }

    return CouponStatus.ACTIVE;
}
