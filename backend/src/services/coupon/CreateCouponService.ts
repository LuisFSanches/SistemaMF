import prismaClient from "../../prisma";
import { createCouponSchema } from "../../schemas/coupon/createCouponSchema";
import { normalizeCouponCode } from "./utils/normalizeCouponCode";
import { BadRequestException } from "../../exceptions/bad-request";
import { ErrorCodes } from "../../exceptions/root";

interface ICreateCouponData {
    store_id: string;
    code: string;
    is_active?: boolean;
    discount_type: string;
    discount_value: number;
    max_discount_amount?: number | null;
    start_date: Date;
    expiration_date: Date;
    total_usage_limit?: number | null;
    usage_limit_per_customer?: number | null;
    specific_customer_id?: string | null;
    minimum_order_amount?: number | null;
}

export class CreateCouponService {
    async execute(data: ICreateCouponData) {
        try {
            // Validate input
            const validatedData = createCouponSchema.parse(data);

            // Normalize coupon code to uppercase
            const normalizedCode = normalizeCouponCode(validatedData.code);

            // Check if code already exists for this store
            const existingCoupon = await prismaClient.coupon.findUnique({
                where: {
                    code_store_id: {
                        code: normalizedCode,
                        store_id: validatedData.store_id,
                    },
                },
            });

            if (existingCoupon) {
                throw new BadRequestException(
                    "Coupon code already exists",
                    ErrorCodes.COUPON_CODE_EXISTS
                );
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

            // Create coupon
            const coupon = await prismaClient.coupon.create({
                data: {
                    ...validatedData,
                    code: normalizedCode,
                },
            });

            return {
                ...coupon,
                discount_value: Number(coupon.discount_value),
                max_discount_amount: coupon.max_discount_amount ? Number(coupon.max_discount_amount) : null,
                minimum_order_amount: coupon.minimum_order_amount ? Number(coupon.minimum_order_amount) : null,
            };
        } catch (error: any) {
            console.error("[CreateCouponService] Failed to create coupon:", error);
            throw error;
        }
    }
}
