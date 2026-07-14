import { z } from "zod";

export const validateCouponSchema = z.object({
    code: z.string().min(1, "Coupon code is required"),
    store_id: z.string().uuid("Store id must be a valid uuid"),
    customerId: z.string().uuid().optional(),
    orderTotal: z.number().positive("Order total must be positive"),
});
