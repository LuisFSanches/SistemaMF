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
    store_id?: string;
}

class CreateStockTransactionService {
    async execute({ product_id, supplier, unity, quantity, unity_price, purchased_date, total_price, store_id }: IStockTransaction) {
        try {
            const formattedPurchasedDate = moment.utc(purchased_date)
                .tz('America/Sao_Paulo', true)
                .set({ hour: 12, minute: 0, second: 0 })
                .toDate();

            // Buscar ou criar fornecedor
            const whereClause: any = { name: supplier.trim() };
            if (store_id) {
                whereClause.store_id = store_id;
            }

            let supplierRecord = await prismaClient.supplier.findFirst({
                where: whereClause
            });

            if (!supplierRecord) {
                supplierRecord = await prismaClient.supplier.create({
                    data: { 
                        name: supplier.trim(),
                        store_id
                    }
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
                    store_id,
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
