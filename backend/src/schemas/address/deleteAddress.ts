import { z } from "zod";

export const deleteAddressSchema = z.string().uuid("Invalid id format");
