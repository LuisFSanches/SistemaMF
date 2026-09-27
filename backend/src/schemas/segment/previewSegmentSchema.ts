import { z } from "zod";
import { segmentCriteriaSchema } from "./segmentCriteriaSchema";

export const previewSegmentDraftSchema = z.object({
    store_id: z.string().uuid().nullable().optional(),
    type: z.enum(["DYNAMIC", "MANUAL"]),
    criteria: segmentCriteriaSchema.optional(),
    client_ids: z.array(z.string().uuid()).optional(),
    page: z.number().int().positive().optional(),
    limit: z.number().int().positive().optional(),
}).refine(
    (data) => data.type !== "DYNAMIC" || !!data.criteria,
    { message: "criteria is required for DYNAMIC segments", path: ["criteria"] }
).refine(
    (data) => data.type !== "MANUAL" || !!data.client_ids,
    { message: "client_ids is required for MANUAL segments", path: ["client_ids"] }
);
