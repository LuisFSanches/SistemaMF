import { 
    IStockValidationRequest, 
    IStockValidationResponse, 
    IProductStockStatus 
} from "../../interfaces/IStockValidation";
import prismaClient from "../../prisma";
import { ErrorCodes } from "../../exceptions/root";
import { stockValidationSchema } from "../../schemas/stock-validation/validateStock";
import { BadRequestException } from "../../exceptions/bad-request";

class ValidateStockService {
    async execute(data: IStockValidationRequest): Promise<IStockValidationResponse> {
        // 1. Validação com Zod
        const parsed = stockValidationSchema.safeParse(data);

        if (!parsed.success) {
            throw new BadRequestException(
                parsed.error.errors[0].message,
                ErrorCodes.VALIDATION_ERROR
            );
        }

        try {
            const storeProductIds = data.items.map(item => item.store_product_id);

            const storeProducts = await prismaClient.storeProduct.findMany({
                where: {
                    id: {
                        in: storeProductIds
                    }
                },
                include: {
                    product: {
                        select: {
                            name: true
                        }
                    }
                }
            });

            // 4. Criar um mapa para acesso rápido aos produtos
            const productsMap = new Map(
                storeProducts.map(sp => [sp.id, sp])
            );

            // 5. Validar cada item do carrinho
            const invalidItems: IProductStockStatus[] = [];

            for (const item of data.items) {
                const storeProduct = productsMap.get(item.store_product_id);

                // Produto não encontrado
                if (!storeProduct) {
                    invalidItems.push({
                        store_product_id: item.store_product_id,
                        product_name: "Produto não encontrado",
                        requested_quantity: item.quantity,
                        available_stock: 0,
                        has_stock: false,
                        is_enabled: false,
                        is_visible: false
                    });
                    continue;
                }

                // Verificar se produto está habilitado
                if (!storeProduct.enabled) {
                    invalidItems.push({
                        store_product_id: item.store_product_id,
                        product_name: storeProduct.product.name,
                        requested_quantity: item.quantity,
                        available_stock: storeProduct.stock,
                        has_stock: storeProduct.stock >= item.quantity,
                        is_enabled: false,
                        is_visible: storeProduct.visible_for_online_store
                    });
                    continue;
                }

                if (!storeProduct.visible_for_online_store) {
                    invalidItems.push({
                        store_product_id: item.store_product_id,
                        product_name: storeProduct.product.name,
                        requested_quantity: item.quantity,
                        available_stock: storeProduct.stock,
                        has_stock: storeProduct.stock >= item.quantity,
                        is_enabled: storeProduct.enabled,
                        is_visible: false
                    });
                    continue;
                }

                if (storeProduct.stock < item.quantity) {
                    invalidItems.push({
                        store_product_id: item.store_product_id,
                        product_name: storeProduct.product.name,
                        requested_quantity: item.quantity,
                        available_stock: storeProduct.stock,
                        has_stock: false,
                        is_enabled: storeProduct.enabled,
                        is_visible: storeProduct.visible_for_online_store
                    });
                }
            }

            const isValid = invalidItems.length === 0;
            
            return {
                is_valid: isValid,
                invalid_items: invalidItems,
                message: isValid 
                    ? "Todos os produtos têm estoque disponível" 
                    : "Alguns produtos não estão disponíveis ou não têm estoque suficiente"
            };

        } catch (error: any) {
            console.error("[ValidateStockService] Failed:", error);

            throw new BadRequestException(
                error.message || "Erro ao validar estoque",
                ErrorCodes.SYSTEM_ERROR
            );
        }
    }
}

export { ValidateStockService };
