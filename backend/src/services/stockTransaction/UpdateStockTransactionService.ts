import prismaClient from '../../prisma';
import moment from 'moment-timezone';
import { ErrorCodes } from "../../exceptions/root";
import { BadRequestException } from "../../exceptions/bad-request";

interface IUpdateStockTransaction {
    id: string;
    store_product_id?: string;
    supplier: string;
    unity: string;
    quantity: number;
    unity_price: number;
    purchased_date: Date;
    total_price: number;
    store_id?: string;
}

class UpdateStockTransactionService {
    async execute({ id, store_product_id, supplier, unity, quantity, unity_price, purchased_date, total_price, store_id }: IUpdateStockTransaction) {
        try {
            const whereClause: any = { id };
            if (store_id) {
                whereClause.store_id = store_id;
            }

            const existing = await prismaClient.stockTransaction.findFirst({
                where: whereClause
            });

            if (!existing) {
                throw new BadRequestException(
                    'Transaction not found',
                    ErrorCodes.USER_NOT_FOUND
                )
            }

            const formattedPurchasedDate = moment.utc(purchased_date)
                .tz('America/Sao_Paulo', true)
                .set({ hour: 12, minute: 0, second: 0 })
                .toDate();

            const supplierWhereClause: any = { name: supplier.trim() };
            if (store_id) {
                supplierWhereClause.store_id = store_id;
            }

            let supplierRecord = await prismaClient.supplier.findFirst({
                where: supplierWhereClause
            });

            if (!supplierRecord) {
                supplierRecord = await prismaClient.supplier.create({
                    data: {
                        name: supplier.trim(),
                        store_id
                    }
                });
            }

            const transaction = await prismaClient.stockTransaction.update({
                where: { id },
                data: {
                    store_product_id,
                    supplier,
                    supplier_id: supplierRecord.id,
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
            console.error("[UpdateStockTransactionService] Failed:", error);

            throw new BadRequestException(
                error.message,
                ErrorCodes.SYSTEM_ERROR
            );
        }
    }
}

export { UpdateStockTransactionService };
