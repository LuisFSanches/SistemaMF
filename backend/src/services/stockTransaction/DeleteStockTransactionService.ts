import prismaClient from '../../prisma';
import { ErrorCodes } from "../../exceptions/root";

class DeleteStockTransactionService {
    async execute(id: string) {
        try {
            const existing = await prismaClient.stockTransaction.findUnique({
                where: { id }
            });

            if (!existing) {
                return { error: true, message: 'Transaction not found', code: ErrorCodes.USER_NOT_FOUND };
            }

            const transaction = await prismaClient.stockTransaction.delete({
                where: { id },
            });

            return transaction;
        } catch (error: any) {
            console.log("[DeleteStockTransactionService] Error:", error.message);
            return { error: true, message: error.message, code: ErrorCodes.SYSTEM_ERROR };
        }
    }
}

export { DeleteStockTransactionService };
