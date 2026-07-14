import prismaClient from "../../prisma";
import { getCouponStatus, CouponStatus } from "./utils/getCouponStatus";

interface IListCouponsParams {
    store_id?: string;
    page?: number;
    limit?: number;
    status?: CouponStatus;
    search?: string;
}

export class ListCouponsService {
    async execute(params: IListCouponsParams = {}) {
        try {
            const page = params.page || 1;
            const limit = params.limit || 20;
            const skip = (page - 1) * limit;

            // Build where clause
            const where: any = {};

            if (params.store_id) {
                where.store_id = params.store_id;
            }

            // Search by code
            if (params.search) {
                where.code = {
                    contains: params.search.toUpperCase(),
                    mode: "insensitive",
                };
            }

            // Fetch coupons
            const [coupons, total] = await Promise.all([
                prismaClient.coupon.findMany({
                    where,
                    skip,
                    take: limit,
                    orderBy: { created_at: "desc" },
                    include: {
                        customer: {
                            select: {
                                id: true,
                                first_name: true,
                                last_name: true,
                                email: true,
                            },
                        },
                    },
                }),
                prismaClient.coupon.count({ where }),
            ]);

            // Compute status for each coupon
            const couponsWithStatus = coupons.map((coupon) => {
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
            });

            // Filter by status if requested
            let filteredCoupons = couponsWithStatus;
            if (params.status) {
                filteredCoupons = couponsWithStatus.filter(
                    (c) => c.computedStatus === params.status
                );
            }

            return {
                coupons: filteredCoupons,
                total: params.status ? filteredCoupons.length : total,
                page,
                limit,
                totalPages: Math.ceil((params.status ? filteredCoupons.length : total) / limit),
            };
        } catch (error: any) {
            console.error("[ListCouponsService] Failed to list coupons:", error);
            throw error;
        }
    }
}
