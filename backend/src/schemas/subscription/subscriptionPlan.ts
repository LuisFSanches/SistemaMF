import { z } from "zod";

export const createSubscriptionPlanSchema = z.object({
    name: z.string().nonempty("Name is required"),
    description: z.string().optional(),
    price: z.number().positive("Price must be positive"),
    billing_cycle: z.enum(["MONTHLY", "ANNUAL"], {
        errorMap: () => ({ message: "Billing cycle must be MONTHLY or ANNUAL" })
    }),
    mp_plan_id: z.string().optional(),
    is_active: z.boolean().optional()
});

export const updateSubscriptionPlanSchema = z.object({
    name: z.string().nonempty("Name is required").optional(),
    description: z.string().optional(),
    price: z.number().positive("Price must be positive").optional(),
    billing_cycle: z.enum(["MONTHLY", "ANNUAL"], {
        errorMap: () => ({ message: "Billing cycle must be MONTHLY or ANNUAL" })
    }).optional(),
    mp_plan_id: z.string().optional(),
    is_active: z.boolean().optional()
});

export type CreateSubscriptionPlanSchemaType = z.infer<typeof createSubscriptionPlanSchema>;
export type UpdateSubscriptionPlanSchemaType = z.infer<typeof updateSubscriptionPlanSchema>;