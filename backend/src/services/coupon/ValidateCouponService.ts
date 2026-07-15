import prismaClient from "../../prisma";
import { validateCouponSchema } from "../../schemas/coupon/validateCouponSchema";
import { normalizeCouponCode } from "./utils/normalizeCouponCode";
import { getCouponStatus, CouponStatus } from "./utils/getCouponStatus";
import { calculateDiscount } from "./utils/calculateDiscount";

interface IValidateCouponData {
    code: string;
    store_id: string;
    customerId?: string;
    orderTotal: number;
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

export class ValidateCouponService {
    async execute(data: IValidateCouponData): Promise<IValidationResult> {
        try {
            // Validate input
            const validatedData = validateCouponSchema.parse(data);

            // Normalize code
            const normalizedCode = normalizeCouponCode(validatedData.code);

            // 1. Fetch coupon by code, scoped to the requesting store
            const coupon = await prismaClient.coupon.findUnique({
                where: {
                    code_store_id: {
                        code: normalizedCode,
                        store_id: validatedData.store_id,
                    },
                },
            });

            if (!coupon) {
                return {
                    valid: false,
                    error_code: "NOT_FOUND",
                    error_message: "Coupon not found",
                };
            }

            // 2. Check if coupon is active
            const status = getCouponStatus({
                id: coupon.id,
                code: coupon.code,
                is_active: coupon.is_active,
                discount_type: coupon.discount_type,
                discount_value: Number(coupon.discount_value),
                max_discount_amount: coupon.max_discount_amount ? Number(coupon.max_discount_amount) : null,
                start_date: coupon.start_date,
                expiration_date: coupon.expiration_date,
                total_usage_limit: coupon.total_usage_limit,
                usage_limit_per_customer: coupon.usage_limit_per_customer,
                current_usage_count: coupon.current_usage_count,
                specific_customer_id: coupon.specific_customer_id,
                minimum_order_amount: coupon.minimum_order_amount ? Number(coupon.minimum_order_amount) : null,
            });

            if (status === CouponStatus.DISABLED) {
                return {
                    valid: false,
                    error_code: "INACTIVE",
                    error_message: "Coupon is inactive",
                };
            }

            if (status === CouponStatus.EXPIRED) {
                return {
                    valid: false,
                    error_code: "EXPIRED",
                    error_message: "Coupon has expired",
                };
            }

            if (status === CouponStatus.NOT_STARTED) {
                return {
                    valid: false,
                    error_code: "NOT_STARTED",
                    error_message: "Coupon is not yet active",
                };
            }

            if (status === CouponStatus.USAGE_LIMIT_REACHED) {
                return {
                    valid: false,
                    error_code: "USAGE_LIMIT_REACHED",
                    error_message: "Coupon usage limit has been reached",
                };
            }

            // 3. Check customer restriction
            if (coupon.specific_customer_id) {
                if (!validatedData.customerId) {
                    return {
                        valid: false,
                        error_code: "CUSTOMER_NOT_ALLOWED",
                        error_message: "This coupon requires authentication",
                    };
                }

                if (coupon.specific_customer_id !== validatedData.customerId) {
                    return {
                        valid: false,
                        error_code: "CUSTOMER_NOT_ALLOWED",
                        error_message: "This coupon is not available for your account",
                    };
                }
            }

            // 4. Check per-customer usage limit
            if (validatedData.customerId && coupon.usage_limit_per_customer) {
                const customerUsageCount = await prismaClient.couponUsageHistory.count({
                    where: {
                        coupon_id: coupon.id,
                        customer_id: validatedData.customerId,
                    },
                });

                if (customerUsageCount >= coupon.usage_limit_per_customer) {
                    return {
                        valid: false,
                        error_code: "CUSTOMER_LIMIT_REACHED",
                        error_message: "You have reached the usage limit for this coupon",
                    };
                }
            }

            // 5. Check minimum order amount
            if (coupon.minimum_order_amount) {
                const minimumAmount = Number(coupon.minimum_order_amount);
                if (validatedData.orderTotal < minimumAmount) {
                    return {
                        valid: false,
                        error_code: "MINIMUM_NOT_MET",
                        error_message: `Order total must be at least ${minimumAmount.toFixed(2)} to use this coupon`,
                    };
                }
            }

            // 6. Calculate discount
            const discountAmount = calculateDiscount(
                {
                    discount_type: coupon.discount_type,
                    discount_value: Number(coupon.discount_value),
                    max_discount_amount: coupon.max_discount_amount ? Number(coupon.max_discount_amount) : null,
                },
                validatedData.orderTotal
            );

            // All validations passed
            return {
                valid: true,
                discount_amount: discountAmount,
                coupon: {
                    id: coupon.id,
                    code: coupon.code,
                    discount_type: coupon.discount_type,
                    discount_value: Number(coupon.discount_value),
                },
            };
        } catch (error: any) {
            console.error("[ValidateCouponService] Failed to validate coupon:", error);
            throw error;
        }
    }
}
