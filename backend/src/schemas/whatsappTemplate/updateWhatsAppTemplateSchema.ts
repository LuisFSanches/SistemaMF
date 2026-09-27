import { z } from "zod";
import { WHATSAPP_TEMPLATE_VARIABLE_TYPES } from "./whatsappTemplateVariableTypes";

export const updateWhatsAppTemplateSchema = z.object({
    name: z.string().min(1, "Name is required").max(120).optional(),
    language_code: z.string().min(2).max(10).optional(),
    variable_types: z.array(z.enum(WHATSAPP_TEMPLATE_VARIABLE_TYPES)).optional(),
    header_type: z.enum(["NONE", "IMAGE", "VIDEO", "DOCUMENT"]).optional(),
    header_media_url: z.string().url().optional().nullable(),
}).transform((data) => ({
    ...data,
    variable_count: data.variable_types ? data.variable_types.length : undefined,
})).refine(
    (data) => data.header_type === undefined || data.header_type === "NONE" || !!data.header_media_url,
    { message: "header_media_url is required when header_type is not NONE", path: ["header_media_url"] }
);
