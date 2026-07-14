import prismaClient from "../../prisma";
import { BadRequestException } from "../../exceptions/bad-request";
import { ErrorCodes } from "../../exceptions/root";

interface IGetUsageHistoryParams {
    couponId: string;
    store_id?: string;
    page?: number;
    limit?: number;
}

export class GetCouponUsageHistoryService {
    async execute(params: IGetUsageHistoryParams) {
        try {
            const { couponId, store_id, page = 1, limit = 50 } = params;
            const skip = (page - 1) * limit;

            // Check if coupon exists (scoped to the requesting store)
            const coupon = await prismaClient.coupon.findFirst({
                where: {
                    id: couponId,
                    ...(store_id ? { store_id } : {}),
                },
            });

            if (!coupon) {
                throw new BadRequestException(
                    "Coupon not found",
                    ErrorCodes.COUPON_NOT_FOUND
                );
            }

            // Fetch usage history
            const [history, total] = await Promise.all([
                prismaClient.couponUsageHistory.findMany({
                    where: { coupon_id: couponId },
                    skip,
                    take: limit,
                    orderBy: { used_at: "desc" },
                    include: {
                        customer: {
                            select: {
                                id: true,
                                first_name: true,
                                last_name: true,
                                email: true,
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
                }),
                prismaClient.couponUsageHistory.count({
                    where: { coupon_id: couponId },
                }),
            ]);

            return {
                history,
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            };
        } catch (error: any) {
            console.error("[GetCouponUsageHistoryService] Failed to get usage history:", error);
            throw error;
        }
    }
}
