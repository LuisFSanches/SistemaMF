import prismaClient from "../../prisma";
import { createCampaignSchema } from "../../schemas/campaign/createCampaignSchema";
import { WhatsAppTemplateVariableType, COUPON_DEPENDENT_VARIABLE_TYPES } from "../../schemas/whatsappTemplate/whatsappTemplateVariableTypes";
import { BadRequestException } from "../../exceptions/bad-request";
import { ErrorCodes } from "../../exceptions/root";

interface ICreateCampaignData {
    store_id?: string | null;
    name: string;
    segment_id: string;
    template_id: string;
    coupon_id?: string;
    variable_values: (string | null)[];
}

export class CreateCampaignService {
    async execute(data: ICreateCampaignData) {
        try {
            const validatedData = createCampaignSchema.parse(data);

            const segment = await prismaClient.segment.findUnique({
                where: { id: validatedData.segment_id },
            });

            if (!segment) {
                throw new BadRequestException("Segment not found", ErrorCodes.SEGMENT_NOT_FOUND);
            }

            const template = await prismaClient.whatsAppTemplate.findUnique({
                where: { id: validatedData.template_id },
            });

            if (!template) {
                throw new BadRequestException("Template not found", ErrorCodes.TEMPLATE_NOT_FOUND);
            }

            if (validatedData.variable_values.length !== template.variable_count) {
                throw new BadRequestException(
                    `Expected ${template.variable_count} variable value(s), got ${validatedData.variable_values.length}`,
                    ErrorCodes.VARIABLE_COUNT_MISMATCH
                );
            }

            const variableTypes = template.variable_types as WhatsAppTemplateVariableType[];

            const emptyTextIndex = variableTypes.findIndex(
                (type, index) => type === "TEXT" && !validatedData.variable_values[index]
            );
            if (emptyTextIndex !== -1) {
                throw new BadRequestException(
                    `Variable {{${emptyTextIndex + 1}}} is a fixed text and cannot be empty`,
                    ErrorCodes.TEXT_VARIABLE_VALUE_REQUIRED
                );
            }

            const requiresCoupon = variableTypes.some((type) => COUPON_DEPENDENT_VARIABLE_TYPES.includes(type));

            if (requiresCoupon && !validatedData.coupon_id) {
                throw new BadRequestException(
                    "This template requires a coupon to be linked to the campaign",
                    ErrorCodes.COUPON_REQUIRED_FOR_TEMPLATE
                );
            }

            if (validatedData.coupon_id) {
                const coupon = await prismaClient.coupon.findFirst({
                    where: {
                        id: validatedData.coupon_id,
                        ...(validatedData.store_id ? { store_id: validatedData.store_id } : {}),
                    },
                });

                if (!coupon) {
                    throw new BadRequestException("Coupon not found", ErrorCodes.COUPON_NOT_FOUND);
                }

                if (variableTypes.includes("COUPON_MAX_DISCOUNT") && coupon.max_discount_amount === null) {
                    throw new BadRequestException(
                        "The selected coupon has no maximum discount amount defined, required by this template",
                        ErrorCodes.COUPON_MISSING_REQUIRED_FIELD
                    );
                }

                if (variableTypes.includes("COUPON_MIN_ORDER_AMOUNT") && coupon.minimum_order_amount === null) {
                    throw new BadRequestException(
                        "The selected coupon has no minimum order amount defined, required by this template",
                        ErrorCodes.COUPON_MISSING_REQUIRED_FIELD
                    );
                }
            }

            const campaign = await prismaClient.campaign.create({
                data: {
                    store_id: validatedData.store_id,
                    name: validatedData.name,
                    segment_id: validatedData.segment_id,
                    template_id: validatedData.template_id,
                    coupon_id: validatedData.coupon_id,
                    variable_values: validatedData.variable_values,
                },
            });

            return campaign;
        } catch (error: any) {
            console.error("[CreateCampaignService] Failed to create campaign:", error);
            throw error;
        }
    }
}
