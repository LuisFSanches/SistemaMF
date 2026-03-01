import { z } from "zod";

export const calculateDeliverySchema = z.object({
    storeId: z.string().nonempty("storeId is required"),
    customerLatitude: z.number({ invalid_type_error: "customerLatitude must be a number" })
        .min(-90, "customerLatitude must be between -90 and 90")
        .max(90, "customerLatitude must be between -90 and 90"),
    customerLongitude: z.number({ invalid_type_error: "customerLongitude must be a number" })
        .min(-180, "customerLongitude must be between -180 and 180")
        .max(180, "customerLongitude must be between -180 and 180"),
    city: z.string().nonempty("city is required"),
});

export type CalculateDeliverySchemaType = z.infer<typeof calculateDeliverySchema>;
