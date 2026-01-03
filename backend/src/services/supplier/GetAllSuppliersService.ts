import prismaClient from "../../prisma";
import { ErrorCodes } from "../../exceptions/root";
import { BadRequestException } from "../../exceptions/bad-request";

class GetAllSuppliersService {
    async execute(store_id?: string) {
        try {
            const whereClause: any = {};

            // Filtro por loja (multi-tenancy)
            if (store_id) {
                whereClause.store_id = store_id;
            }

            const suppliers = await prismaClient.supplier.findMany({
                where: whereClause,
                orderBy: {
                    name: 'asc'
                },
                include: {
                    _count: {
                        select: {
                            stockTransactions: true
                        }
                    }
                }
            });

            return suppliers;
        } catch (error: any) {
            console.error("[GetAllSuppliersService] Failed:", error);

            throw new BadRequestException(
                error.message,
                ErrorCodes.SYSTEM_ERROR
            );
        }
    }
}

export { GetAllSuppliersService };
