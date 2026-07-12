import { z } from "zod";

export const createSubscriptionSchema = z.object({
    store_id: z.string().uuid("Store ID must be a valid UUID"),
    subscription_plan_id: z.string().uuid("Subscription plan ID must be a valid UUID"),
    mp_subscription_id: z.string().optional(),
    status: z.enum(["PENDING", "ACTIVE", "CANCELLED", "EXPIRED"], {
        errorMap: () => ({ message: "Status must be PENDING, ACTIVE, CANCELLED, or EXPIRED" })
    }).optional(),
    start_date: z.string().datetime().optional(),
    end_date: z.string().datetime().optional(),
    next_billing_date: z.string().datetime().optional(),
    trial_end_date: z.string().datetime().optional()
});

export const updateSubscriptionSchema = z.object({
    subscription_plan_id: z.string().uuid("Subscription plan ID must be a valid UUID").optional(),
    mp_subscription_id: z.string().optional(),
    status: z.enum(["PENDING", "ACTIVE", "CANCELLED", "EXPIRED"], {
        errorMap: () => ({ message: "Status must be PENDING, ACTIVE, CANCELLED, or EXPIRED" })
    }).optional(),
    start_date: z.string().datetime().optional(),
    end_date: z.string().datetime().optional(),
    next_billing_date: z.string().datetime().optional(),
    trial_end_date: z.string().datetime().optional()
});

export const checkSubscriptionStatusSchema = z.object({
    store_id: z.string().uuid("Store ID must be a valid UUID")
});

export type CreateSubscriptionSchemaType = z.infer<typeof createSubscriptionSchema>;
export type UpdateSubscriptionSchemaType = z.infer<typeof updateSubscriptionSchema>;
export type CheckSubscriptionStatusSchemaType = z.infer<typeof checkSubscriptionStatusSchema>;