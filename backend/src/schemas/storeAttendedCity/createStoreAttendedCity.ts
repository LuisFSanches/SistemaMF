import { z } from "zod";

export const createStoreAttendedCitySchema = z.object({
    store_id: z.string().nonempty("store_id is required"),
    city: z.string().nonempty("city is required"),
    state: z.string().nonempty("state is required"),
});

export type CreateStoreAttendedCitySchemaType = z.infer<typeof createStoreAttendedCitySchema>;
