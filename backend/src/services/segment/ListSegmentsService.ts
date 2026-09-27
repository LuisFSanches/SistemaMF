import prismaClient from "../../prisma";

interface IListSegmentsParams {
    store_id?: string;
    page?: number;
    limit?: number;
}

export class ListSegmentsService {
    async execute(params: IListSegmentsParams = {}) {
        try {
            const page = params.page || 1;
            const limit = params.limit || 20;
            const skip = (page - 1) * limit;

            const where: any = {};
            if (params.store_id) {
                where.store_id = params.store_id;
            }

            const [segments, total] = await Promise.all([
                prismaClient.segment.findMany({
                    where,
                    skip,
                    take: limit,
                    orderBy: { created_at: "desc" },
                    include: {
                        _count: { select: { clients: true } },
                    },
                }),
                prismaClient.segment.count({ where }),
            ]);

            return {
                segments,
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            };
        } catch (error: any) {
            console.error("[ListSegmentsService] Failed to list segments:", error);
            throw error;
        }
    }
}
