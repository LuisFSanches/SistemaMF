import prismaClient from "../../prisma";

interface IListCampaignsParams {
    store_id?: string;
    page?: number;
    limit?: number;
}

export class ListCampaignsService {
    async execute(params: IListCampaignsParams = {}) {
        try {
            const page = params.page || 1;
            const limit = params.limit || 20;
            const skip = (page - 1) * limit;

            const where: any = {};
            if (params.store_id) {
                where.store_id = params.store_id;
            }

            const [campaigns, total] = await Promise.all([
                prismaClient.campaign.findMany({
                    where,
                    skip,
                    take: limit,
                    orderBy: { created_at: "desc" },
                    include: {
                        segment: { select: { id: true, name: true } },
                        template: { select: { id: true, name: true } },
                        coupon: { select: { id: true, code: true } },
                    },
                }),
                prismaClient.campaign.count({ where }),
            ]);

            return {
                campaigns,
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            };
        } catch (error: any) {
            console.error("[ListCampaignsService] Failed to list campaigns:", error);
            throw error;
        }
    }
}
