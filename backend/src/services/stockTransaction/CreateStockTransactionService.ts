import prismaClient from '../../prisma';
import { ErrorCodes } from "../../exceptions/root";
import moment from 'moment-timezone';

interface IStockTransaction {
    product_id: string;
    supplier: string;
    unity: string;
    quantity: number;
    unity_price: number;
    purchased_date: Date;
}

class CreateStockTransactionService {
    async execute({ product_id, supplier, unity, quantity, unity_price, purchased_date }: IStockTransaction) {
        try {
            const total_price = quantity * unity_price;
            const formattedPurchasedDate = moment.utc(purchased_date)
                .tz('America/Sao_Paulo', true)
                .set({ hour: 12, minute: 0, second: 0 })
                .toDate();

            const transaction = await prismaClient.stockTransaction.create({
                data: {
                    product_id,
                    supplier,
                    unity,
                    quantity,
                    unity_price,
                    total_price,
                    purchased_date: formattedPurchasedDate,
                },
            });

            return transaction;
        } catch (error: any) {
            console.log("[CreateStockTransactionService] Error:", error.message);
            return { error: true, message: error.message, code: ErrorCodes.SYSTEM_ERROR };
        }
    }
}

export { CreateStockTransactionService };
