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

            // Buscar ou criar fornecedor
            let supplierRecord = await prismaClient.supplier.findFirst({
                where: { name: supplier.trim() }
            });

            if (!supplierRecord) {
                supplierRecord = await prismaClient.supplier.create({
                    data: { name: supplier.trim() }
                });
            }

            const transaction = await prismaClient.stockTransaction.create({
                data: {
                    product_id,
                    supplier, // Manter para compatibilidade (deprecated)
                    supplier_id: supplierRecord.id, // Nova referência
                    unity,
                    quantity,
                    unity_price,
                    total_price,
                    purchased_date: formattedPurchasedDate,
                },
                include: {
                    product: true,
                    supplierRelation: true
                }
            });

            return transaction;
        } catch (error: any) {
            console.error("[CreateStockTransactionService] Failed:", error);
            
            throw new BadRequestException(
                error.message,
                ErrorCodes.SYSTEM_ERROR
            );
        }
    }
}

export { CreateStockTransactionService };
