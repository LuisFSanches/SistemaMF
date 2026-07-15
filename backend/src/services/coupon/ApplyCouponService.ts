import prismaClient from "../../prisma";
import { BadRequestException } from "../../exceptions/bad-request";
import { ErrorCodes } from "../../exceptions/root";

interface IApplyCouponData {
    couponId: string;
    customerId: string;
    orderId: string;
    discountAmount: number;
}

export class ApplyCouponService {
    async execute(data: IApplyCouponData) {
        try {
            // Execute all operations in a transaction
            const result = await prismaClient.$transaction(async (tx) => {
                // 1. Fetch and lock the coupon for update
                const coupon = await tx.coupon.findUnique({
                    where: { id: data.couponId },
                });

                if (!coupon) {
                    throw new BadRequestException(
                        "Coupon not found",
                        ErrorCodes.COUPON_NOT_FOUND
                    );
                }

                // 2. Check if order already has a coupon applied
                const existingUsage = await tx.couponUsageHistory.findUnique({
                    where: { order_id: data.orderId },
                });

                if (existingUsage) {
                    throw new BadRequestException(
                        "This order already has a coupon applied",
                        ErrorCodes.COUPON_ALREADY_APPLIED
                    );
                }

                // 3. Increment coupon usage count
                await tx.coupon.update({
                    where: { id: data.couponId },
                    data: {
                        current_usage_count: {
                            increment: 1,
                        },
                    },
                });

                // 4. Create usage history record
                const usageHistory = await tx.couponUsageHistory.create({
                    data: {
                        coupon_id: data.couponId,
                        customer_id: data.customerId,
                        order_id: data.orderId,
                        discount_amount: data.discountAmount,
                    },
                });

                return usageHistory;
            });

            return result;
        } catch (error: any) {
            console.error("[ApplyCouponService] Failed to apply coupon:", error);
            throw error;
        }
    }
}
