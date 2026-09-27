import { z } from "zod";

export const createCampaignSchema = z.object({
    store_id: z.string().uuid().nullable().optional(),
    name: z.string().min(1, "Name is required").max(120),
    segment_id: z.string().uuid(),
    template_id: z.string().uuid(),
    coupon_id: z.string().uuid().optional(),
    variable_values: z.array(z.string().nullable()),
});
