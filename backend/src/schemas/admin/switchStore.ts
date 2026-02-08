import { z } from "zod";

export const switchStoreSchema = z.object({
    store_id: z.string().uuid("store_id must be a valid UUID"),
});

export type SwitchStoreSchemaType = z.infer<typeof switchStoreSchema>;
