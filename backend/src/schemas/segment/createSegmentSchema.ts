import { z } from "zod";
import { segmentCriteriaSchema } from "./segmentCriteriaSchema";

export const createSegmentSchema = z.object({
    store_id: z.string().uuid().nullable().optional(),
    name: z.string().min(1, "Name is required").max(120),
    description: z.string().max(500).optional().nullable(),
    type: z.enum(["DYNAMIC", "MANUAL"]),
    criteria: segmentCriteriaSchema.optional(),
    client_ids: z.array(z.string().uuid()).optional(),
}).refine(
    (data) => data.type !== "DYNAMIC" || !!data.criteria,
    { message: "criteria is required for DYNAMIC segments", path: ["criteria"] }
).refine(
    (data) => data.type !== "MANUAL" || (!!data.client_ids && data.client_ids.length > 0),
    { message: "client_ids is required for MANUAL segments", path: ["client_ids"] }
);
