import prismaClient from "../../prisma";
import { ErrorCodes } from "../../exceptions/root";
import { BadRequestException } from "../../exceptions/bad-request";

class UpdateProductSalesCountService {
    async execute() {
        try {
            // Atualiza o sales_count de todos os produtos de uma vez
            // usando uma query SQL eficiente
            await prismaClient.$executeRaw`
                UPDATE products p
                SET sales_count = COALESCE(subquery.order_count, 0),
                    updated_at = NOW()
                FROM (
                    SELECT 
                        oi.product_id,
                        COUNT(DISTINCT oi.order_id) as order_count
                    FROM order_items oi
                    GROUP BY oi.product_id
                ) as subquery
                WHERE p.id = subquery.product_id
            `;

            // Zera o contador de produtos que não têm vendas
            await prismaClient.$executeRaw`
                UPDATE products
                SET sales_count = 0,
                    updated_at = NOW()
                WHERE id NOT IN (
                    SELECT DISTINCT product_id 
                    FROM order_items
                )
                AND sales_count != 0
            `;

            return {
                success: true,
                message: 'Product sales counts updated successfully'
            };
        } catch (error: any) {

            throw new BadRequestException(
                error.message,
                ErrorCodes.SYSTEM_ERROR
            );
        }
    }
}

export { UpdateProductSalesCountService };
