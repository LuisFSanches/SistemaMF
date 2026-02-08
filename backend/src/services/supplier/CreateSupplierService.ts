import { ISupplier } from "../../interfaces/ISupplier";
import prismaClient from "../../prisma";
import { ErrorCodes } from "../../exceptions/root";
import { createSupplierSchema } from "../../schemas/supplier/createSupplier";
import { BadRequestException } from "../../exceptions/bad-request";

class CreateSupplierService {
    async execute(data: ISupplier, store_id?: string) {
        // Validação com Zod
        const parsed = createSupplierSchema.safeParse(data);

        if (!parsed.success) {
            throw new BadRequestException(
                parsed.error.errors[0].message,
                ErrorCodes.VALIDATION_ERROR
            );
        }

        // Verificar se fornecedor já existe na mesma loja
        const whereClause: any = { name: parsed.data.name };
        if (store_id) {
            whereClause.store_id = store_id;
        }

        const existingSupplier = await prismaClient.supplier.findFirst({
            where: whereClause,
        });

        if (existingSupplier) {
            throw new BadRequestException(
                "Supplier already exists",
                ErrorCodes.USER_ALREADY_EXISTS
            );
        }

        // Criar fornecedor
        try {
            const supplier = await prismaClient.supplier.create({ 
                data: {
                    name: parsed.data.name,
                    store_id
                }
            });
            
            return supplier;
        } catch (error: any) {
            console.error("[CreateSupplierService] Failed:", error);

            throw new BadRequestException(
                error.message,
                ErrorCodes.SYSTEM_ERROR
            );
        }
    }
}

export { CreateSupplierService };
