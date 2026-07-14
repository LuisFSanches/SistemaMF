import { z } from "zod";

export const createCouponSchema = z.object({
    store_id: z.string().uuid("Store id must be a valid uuid"),
    code: z.string().min(1, "Coupon code is required").max(50, "Coupon code is too long"),
    is_active: z.boolean().default(true),
    discount_type: z.enum(["FIXED", "PERCENTAGE"], {
        errorMap: () => ({ message: "Discount type must be FIXED or PERCENTAGE" }),
    }),
    discount_value: z.number().positive("Discount value must be positive"),
    max_discount_amount: z.number().positive().optional().nullable(),
    start_date: z.coerce.date(),
    expiration_date: z.coerce.date(),
    total_usage_limit: z.number().int().positive().optional().nullable(),
    usage_limit_per_customer: z.number().int().positive().optional().nullable(),
    specific_customer_id: z.string().uuid().optional().nullable(),
    minimum_order_amount: z.number().positive().optional().nullable(),
}).refine(
    (data) => data.expiration_date > data.start_date,
    {
        message: "Expiration date must be after start date",
        path: ["expiration_date"],
    }
).transform((data) => {
    // max_discount_amount is only meaningful for PERCENTAGE type; ignore it for FIXED
    // instead of failing, since it's a harmless leftover rather than a real user error.
    if (data.discount_type === "FIXED") {
        return { ...data, max_discount_amount: null };
    }
    return data;
}).refine(
    (data) => {
        // For PERCENTAGE type, value should be between 0 and 100
        if (data.discount_type === "PERCENTAGE" && (data.discount_value > 100 || data.discount_value <= 0)) {
            return false;
        }
        return true;
    },
    {
        message: "Percentage discount must be between 0 and 100",
        path: ["discount_value"],
    }
);
