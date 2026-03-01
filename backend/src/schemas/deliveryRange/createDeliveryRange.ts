import { z } from "zod";

export const createDeliveryRangeSchema = z.object({
    store_id: z.string().nonempty("store_id is required"),
    min_km: z.number().nonnegative("min_km must be >= 0"),
    max_km: z.number().positive("max_km must be > 0"),
    price: z.number().nonnegative("price must be >= 0"),
}).refine((data) => data.max_km > data.min_km, {
    message: "max_km must be greater than min_km",
    path: ["max_km"],
});

export type CreateDeliveryRangeSchemaType = z.infer<typeof createDeliveryRangeSchema>;
