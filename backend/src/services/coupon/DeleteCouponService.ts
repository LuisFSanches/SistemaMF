import prismaClient from "../../prisma";
import { BadRequestException } from "../../exceptions/bad-request";
import { ErrorCodes } from "../../exceptions/root";

export class DeleteCouponService {
    async execute(couponId: string, store_id?: string) {
        try {
            // Check if coupon exists (scoped to the requesting store)
            const existingCoupon = await prismaClient.coupon.findFirst({
                where: {
                    id: couponId,
                    ...(store_id ? { store_id } : {}),
                },
            });

            if (!existingCoupon) {
                throw new BadRequestException(
                    "Coupon not found",
                    ErrorCodes.COUPON_NOT_FOUND
                );
            }

            // Soft delete: set is_active to false
            const coupon = await prismaClient.coupon.update({
                where: { id: couponId },
                data: { is_active: false },
            });

            return { success: true, coupon };
        } catch (error: any) {
            console.error("[DeleteCouponService] Failed to delete coupon:", error);
            throw error;
        }
    }
}
