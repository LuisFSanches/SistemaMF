import prismaClient from '../../prisma';
import { ErrorCodes } from "../../exceptions/root";

class DailySalesService {
    async execute(initial_date: any, final_date: any) {
        const start = new Date(initial_date);
        const end = new Date(final_date);

        if (isNaN(start.getTime()) || isNaN(end.getTime())) {
            throw new Error("Invalid date format");
        }

        const [startDate, endDate] = start > end ? [end, start] : [start, end];

        try {
            const orders = await prismaClient.order.findMany({
                where: {
                created_at: {
                    gte: startDate,
                    lte: endDate,
                },
                },
                select: {
                    created_at: true,
                },
            });

            const dayCount: Record<string, number> = {
                "segunda-feira": 0,
                "terça-feira": 0,
                "quarta-feira": 0,
                "quinta-feira": 0,
                "sexta-feira": 0,
                sábado: 0,
                domingo: 0,
            };

            orders.forEach((order) => {
                const day = new Date(order.created_at).toLocaleString("pt-BR", {
                    weekday: "long",
                });

                if (day in dayCount) {
                    dayCount[day] += 1;
                }
            });

            return dayCount;
        } catch (error: any) {
            return { error: true, message: error.message, code: "SYSTEM_ERROR" };
        }
    }
}

export { DailySalesService };