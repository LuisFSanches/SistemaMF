import prismaClient from "../../prisma";
import { updateCouponSchema } from "../../schemas/coupon/updateCouponSchema";
import { normalizeCouponCode } from "./utils/normalizeCouponCode";
import { BadRequestException } from "../../exceptions/bad-request";
import { ErrorCodes } from "../../exceptions/root";

interface IUpdateCouponData {
    code?: string;
    is_active?: boolean;
    discount_type?: string;
    discount_value?: number;
    max_discount_amount?: number | null;
    start_date?: Date;
    expiration_date?: Date;
    total_usage_limit?: number | null;
    usage_limit_per_customer?: number | null;
    specific_customer_id?: string | null;
    minimum_order_amount?: number | null;
}

export class UpdateCouponService {
    async execute(couponId: string, store_id: string | undefined, data: IUpdateCouponData) {
        try {
            // Validate input
            const validatedData = updateCouponSchema.parse(data);

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

            // If updating code, normalize and check for duplicates
            let normalizedCode: string | undefined;
            if (validatedData.code) {
                normalizedCode = normalizeCouponCode(validatedData.code);

                // Check if new code already exists for this store (excluding current coupon)
                const codeExists = await prismaClient.coupon.findFirst({
                    where: {
                        code: normalizedCode,
                        store_id: existingCoupon.store_id,
                        NOT: { id: couponId },
                    },
                });

                if (codeExists) {
                    throw new BadRequestException(
                        "Coupon code already exists",
                        ErrorCodes.COUPON_CODE_EXISTS
                    );
                }
            }

            // If specific customer is set, verify customer exists
            if (validatedData.specific_customer_id) {
                const customer = await prismaClient.client.findUnique({
                    where: { id: validatedData.specific_customer_id },
                });

                if (!customer) {
                    throw new BadRequestException(
                        "Specified customer not found",
                        ErrorCodes.CLIENT_NOT_FOUND
                    );
                }
            }

            // Update coupon
            const updateData: any = { ...validatedData };
            if (normalizedCode) {
                updateData.code = normalizedCode;
            }

            const coupon = await prismaClient.coupon.update({
                where: { id: couponId },
                data: updateData,
            });

            return {
                ...coupon,
                discount_value: Number(coupon.discount_value),
                max_discount_amount: coupon.max_discount_amount ? Number(coupon.max_discount_amount) : null,
                minimum_order_amount: coupon.minimum_order_amount ? Number(coupon.minimum_order_amount) : null,
            };
        } catch (error: any) {
            console.error("[UpdateCouponService] Failed to update coupon:", error);
            throw error;
        }
    }
}
