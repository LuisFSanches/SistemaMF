import { Decimal } from "@prisma/client/runtime/library";

export interface ICoupon {
    discount_type: string;
    discount_value: number;
    max_discount_amount?: number | null;
}

export function calculateDiscount(
    coupon: ICoupon,
    orderTotal: number
): number {
    if (coupon.discount_type === "FIXED") {
        // Fixed discount cannot exceed order total
        return Math.min(coupon.discount_value, orderTotal);
    }

    if (coupon.discount_type === "PERCENTAGE") {
        // Calculate percentage discount
        const percentageDiscount = orderTotal * (coupon.discount_value / 100);

        // Apply max discount cap if present
        if (coupon.max_discount_amount !== null && coupon.max_discount_amount !== undefined) {
            return Math.min(percentageDiscount, coupon.max_discount_amount);
        }

        return percentageDiscount;
    }

    return 0;
}
