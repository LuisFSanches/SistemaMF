import prismaClient from "../../prisma";
import { ErrorCodes } from "../../exceptions/root";
import { BadRequestException } from "../../exceptions/bad-request";

class GetAllSuppliersService {
    async execute() {
        try {
            const suppliers = await prismaClient.supplier.findMany({
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
