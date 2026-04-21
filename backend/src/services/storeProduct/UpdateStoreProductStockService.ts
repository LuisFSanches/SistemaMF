import prismaClient from "../../prisma";
import { ErrorCodes } from "../../exceptions/root";
import { BadRequestException } from "../../exceptions/bad-request";

interface IUpdateStoreProductStockRequest {
    order_id: string;
}

class UpdateStoreProductStockService {
    async execute({ order_id }: IUpdateStoreProductStockRequest) {
        try {
            const order = await this.fetchOrderWithItems(order_id);
            const updatedProducts = await this.updateAllProductsStock(order);
            
            this.logSuccess(order.code, updatedProducts.length);
            
            return this.buildResponse(order_id, order.code, updatedProducts);
        } catch (error: any) {
            console.error("[UpdateStoreProductStockService] Failed:", error);

            if (error instanceof BadRequestException) {
                throw error;
            }

            throw new BadRequestException(
                error.message,
                ErrorCodes.SYSTEM_ERROR
            );
        }
    }

    private async fetchOrderWithItems(order_id: string) {
        const order = await prismaClient.order.findUnique({
            where: { id: order_id },
            include: {
                orderItems: {
                    include: {
                        storeProduct: true
                    }
                }
            }
        });

        if (!order) {
            throw new BadRequestException(
                "Order not found",
                ErrorCodes.USER_NOT_FOUND
            );
        }

        return order;
    }

    private async updateAllProductsStock(order: any) {
        const updatePromises = order.orderItems.map((item: any) => 
            this.updateProductStock(item)
        );

        const results = await Promise.all(updatePromises);
        
        return results.filter(result => result !== null);
    }

    private async updateProductStock(item: any) {
        if (!item.store_product_id || !item.storeProduct) {
            console.warn(`[UpdateStoreProductStockService] OrderItem ${item.id} has no store_product_id`);
            return null;
        }

        const newStock = this.calculateNewStock(item.storeProduct.stock, item.quantity);
        
        this.validateStock(item.storeProduct.id, item.storeProduct.stock, item.quantity, newStock);

        return prismaClient.storeProduct.update({
            where: { id: item.store_product_id },
            data: {
                stock: newStock,
                updated_at: new Date()
            }
        });
    }

    private calculateNewStock(currentStock: number, quantity: number): number {
        return currentStock - quantity;
    }

    private validateStock(productId: string, currentStock: number, quantity: number, newStock: number) {
        if (newStock < 0) {
            console.warn(
                `[UpdateStoreProductStockService] Insufficient stock for product ${productId}. ` +
                `Current: ${currentStock}, Required: ${quantity}`
            );
        }
    }

    private logSuccess(orderCode: number, productsCount: number) {
        console.log(
            `[UpdateStoreProductStockService] Updated stock for ${productsCount} products ` +
            `from order ${orderCode}`
        );
    }

    private buildResponse(order_id: string, order_code: number, updatedProducts: any[]) {
        return {
            success: true,
            order_id: order_id,
            order_code: order_code,
            updated_products_count: updatedProducts.length,
            updated_products: updatedProducts
        };
    }
}

export { UpdateStoreProductStockService };
