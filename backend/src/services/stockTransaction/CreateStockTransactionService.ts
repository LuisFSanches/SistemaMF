import prismaClient from '../../prisma';
import moment from 'moment-timezone';
import { ErrorCodes } from "../../exceptions/root";
import { BadRequestException } from "../../exceptions/bad-request";

interface IStockTransaction {
    product_id: string;
    supplier: string;
    unity: string;
    quantity: number;
    unity_price: number;
    purchased_date: Date;
    total_price: number;
}

class CreateStockTransactionService {
    async execute({ product_id, supplier, unity, quantity, unity_price, purchased_date, total_price }: IStockTransaction) {
        try {
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
            throw new BadRequestException(
                error.message,
                ErrorCodes.SYSTEM_ERROR
            );
        }
    }
}

export { CreateStockTransactionService };
