import prismaClient from "../../prisma";
import { segmentCriteriaSchema, SegmentCriteria } from "../../schemas/segment/segmentCriteriaSchema";
import { BadRequestException } from "../../exceptions/bad-request";
import { ErrorCodes } from "../../exceptions/root";

interface IPreviewSegmentParams {
    store_id?: string | null;
    type: "DYNAMIC" | "MANUAL";
    criteria?: SegmentCriteria;
    client_ids?: string[];
    page?: number;
    limit?: number;
}

const CLIENT_SELECT = {
    id: true,
    first_name: true,
    last_name: true,
    phone_number: true,
    country_code: true,
    email: true,
};

export class PreviewSegmentService {
    async execute(params: IPreviewSegmentParams) {
        try {
            const page = params.page ?? 1;
            const limit = params.limit ?? 50;

            if (params.type === "MANUAL") {
                return this.previewManualSegment(params.client_ids ?? [], page, limit);
            }

            return this.previewDynamicSegment(params.store_id ?? undefined, params.criteria, page, limit);
        } catch (error: any) {
            console.error("[PreviewSegmentService] Failed to preview segment:", error);
            throw error;
        }
    }

    private async previewManualSegment(clientIds: string[], page: number, limit: number) {
        const where = { id: { in: clientIds } };

        const [clients, total] = await Promise.all([
            prismaClient.client.findMany({
                where,
                select: CLIENT_SELECT,
                skip: (page - 1) * limit,
                take: limit,
                orderBy: { first_name: "asc" },
            }),
            prismaClient.client.count({ where }),
        ]);

        return { clients, total, page, limit, totalPages: Math.ceil(total / limit) };
    }

    private async previewDynamicSegment(
        store_id: string | undefined,
        rawCriteria: SegmentCriteria | undefined,
        page: number,
        limit: number
    ) {
        const validatedCriteria = segmentCriteriaSchema.parse(rawCriteria);

        const orderWhere: any = {};
        if (store_id) {
            orderWhere.store_id = store_id;
        }

        if (validatedCriteria.purchase_recency) {
            const referenceDate = await this.resolveReferenceDate(validatedCriteria.purchase_recency);
            const { days_before, days_after } = validatedCriteria.purchase_recency;
            orderWhere.delivery_date = {
                gte: new Date(referenceDate.getTime() - days_before * 86400000),
                lte: new Date(referenceDate.getTime() + days_after * 86400000),
            };
        }

        if (validatedCriteria.category) {
            orderWhere.orderItems = {
                some: {
                    product: {
                        categories: {
                            some: { category_id: { in: validatedCriteria.category.category_ids } },
                        },
                    },
                },
            };
        }

        if (validatedCriteria.min_order_value) {
            orderWhere.total = { gte: validatedCriteria.min_order_value.min_total };
        }

        const hasOrderLevelFilter = Object.keys(orderWhere).length > (store_id ? 1 : 0);
        const clientWhere: any = hasOrderLevelFilter ? { orders: { some: orderWhere } } : {};

        if (!validatedCriteria.min_order_count) {
            const [clients, total] = await Promise.all([
                prismaClient.client.findMany({
                    where: clientWhere,
                    select: CLIENT_SELECT,
                    skip: (page - 1) * limit,
                    take: limit,
                    orderBy: { first_name: "asc" },
                }),
                prismaClient.client.count({ where: clientWhere }),
            ]);

            return { clients, total, page, limit, totalPages: Math.ceil(total / limit) };
        }

        // min_order_count is an aggregate over the client's full order history, so it can't
        // be expressed as a Prisma `where` alongside the per-order filters above. It's applied
        // in memory after fetching candidates that already satisfy the per-order filters.
        const countWhere: any = store_id ? { store_id } : {};
        const minCount = validatedCriteria.min_order_count.min_count;

        const candidates = await prismaClient.client.findMany({
            where: clientWhere,
            select: {
                ...CLIENT_SELECT,
                _count: { select: { orders: { where: countWhere } } },
            },
            orderBy: { first_name: "asc" },
        });

        const filtered = candidates.filter((c) => c._count.orders >= minCount);
        const paged = filtered.slice((page - 1) * limit, (page - 1) * limit + limit);

        return {
            clients: paged.map(({ _count, ...client }) => client),
            total: filtered.length,
            page,
            limit,
            totalPages: Math.ceil(filtered.length / limit),
        };
    }

    private async resolveReferenceDate(filter: NonNullable<SegmentCriteria["purchase_recency"]>) {
        if (filter.reference === "FIXED_DATE") {
            return filter.fixed_date!;
        }

        const specialDate = await prismaClient.specialDate.findUnique({
            where: { id: filter.special_date_id! },
        });

        if (!specialDate) {
            throw new BadRequestException(
                "Special date not found",
                ErrorCodes.SPECIAL_DATE_NOT_FOUND
            );
        }

        return specialDate.date;
    }
}
