import prismaClient from "../../prisma";
import { getCouponStatus } from "./utils/getCouponStatus";
import { BadRequestException } from "../../exceptions/bad-request";
import { ErrorCodes } from "../../exceptions/root";

export class GetCouponDetailsService {
    async execute(couponId: string, store_id?: string) {
        try {
            const coupon = await prismaClient.coupon.findFirst({
                where: {
                    id: couponId,
                    ...(store_id ? { store_id } : {}),
                },
                include: {
                    customer: {
                        select: {
                            id: true,
                            first_name: true,
                            last_name: true,
                            email: true,
                            phone_number: true,
                        },
                    },
                    usage_history: {
                        orderBy: { used_at: "desc" },
                        take: 50,
                        include: {
                            customer: {
                                select: {
                                    id: true,
                                    first_name: true,
                                    last_name: true,
                                },
                            },
                            order: {
                                select: {
                                    id: true,
                                    code: true,
                                    total: true,
                                    created_at: true,
                                },
                            },
                        },
                    },
                },
            });

            if (!coupon) {
                throw new BadRequestException(
                    "Coupon not found",
                    ErrorCodes.COUPON_NOT_FOUND
                );
            }

            const computedStatus = getCouponStatus({
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

            return {
                ...coupon,
                discount_value: Number(coupon.discount_value),
                max_discount_amount: coupon.max_discount_amount ? Number(coupon.max_discount_amount) : null,
                minimum_order_amount: coupon.minimum_order_amount ? Number(coupon.minimum_order_amount) : null,
                computedStatus,
            };
        } catch (error: any) {
            console.error("[GetCouponDetailsService] Failed to get coupon details:", error);
            throw error;
        }
    }
}
