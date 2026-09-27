import prismaClient from "../../prisma";

interface IListSpecialDatesParams {
    store_id?: string;
}

export class ListSpecialDatesService {
    async execute(params: IListSpecialDatesParams = {}) {
        try {
            const where: any = {};

            if (params.store_id) {
                where.store_id = params.store_id;
            }

            const specialDates = await prismaClient.specialDate.findMany({
                where,
                orderBy: { date: "asc" },
            });

            return { specialDates };
        } catch (error: any) {
            console.error("[ListSpecialDatesService] Failed to list special dates:", error);
            throw error;
        }
    }
}
