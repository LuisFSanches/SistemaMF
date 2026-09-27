import prismaClient from "../../prisma";
import { PreviewSegmentService } from "../segment/PreviewSegmentService";

export interface ICampaignRecipient {
    client_id: string;
    phone_number: string;
    country_code: string;
    store_name: string | null;
}

const MAX_SEGMENT_SIZE = 100000;

export class ResolveCampaignRecipientsService {
    async execute(segmentId: string): Promise<ICampaignRecipient[]> {
        const segment = await prismaClient.segment.findUnique({
            where: { id: segmentId },
            include: { clients: { select: { client_id: true } } },
        });

        if (!segment) {
            return [];
        }

        const previewSegmentService = new PreviewSegmentService();
        const preview = await previewSegmentService.execute({
            store_id: segment.store_id,
            type: segment.type,
            criteria: (segment.criteria as any) ?? undefined,
            client_ids: segment.clients.map((c) => c.client_id),
            page: 1,
            limit: MAX_SEGMENT_SIZE,
        });

        const clientIds = preview.clients.map((c) => c.id);
        if (clientIds.length === 0) {
            return [];
        }

        // Resolve, per client, the store of their most recent order — used to fill
        // the STORE_NAME template variable. Clients with no orders get null.
        const latestOrders = await prismaClient.order.findMany({
            where: {
                client_id: { in: clientIds },
                ...(segment.store_id ? { store_id: segment.store_id } : {}),
            },
            orderBy: [{ client_id: "asc" }, { delivery_date: "desc" }],
            select: {
                client_id: true,
                store: { select: { name: true } },
            },
        });

        const latestStoreByClient = new Map<string, string | null>();
        for (const order of latestOrders) {
            if (!latestStoreByClient.has(order.client_id)) {
                latestStoreByClient.set(order.client_id, order.store?.name ?? null);
            }
        }

        return preview.clients.map((client) => ({
            client_id: client.id,
            phone_number: client.phone_number,
            country_code: client.country_code,
            store_name: latestStoreByClient.get(client.id) ?? null,
        }));
    }
}
