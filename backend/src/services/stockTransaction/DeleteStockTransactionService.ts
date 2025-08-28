import prismaClient from '../../prisma';
import { ErrorCodes } from "../../exceptions/root";
import { BadRequestException } from "../../exceptions/bad-request";

class DeleteStockTransactionService {
    async execute(id: string) {
        try {
            const existing = await prismaClient.stockTransaction.findUnique({
                where: { id }
            });

            if (!existing) {
                throw new BadRequestException(
                    'Transaction not found',
                    ErrorCodes.USER_NOT_FOUND
                )
            }

            const transaction = await prismaClient.stockTransaction.delete({
                where: { id },
            });

            return transaction;
        } catch (error: any) {
            throw new BadRequestException(
                error.message,
                ErrorCodes.SYSTEM_ERROR
            );
        }
    }
}

export { DeleteStockTransactionService };
