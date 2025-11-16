import { ISupplier } from "../../interfaces/ISupplier";
import prismaClient from "../../prisma";
import { ErrorCodes } from "../../exceptions/root";
import { createSupplierSchema } from "../../schemas/supplier/createSupplier";
import { BadRequestException } from "../../exceptions/bad-request";

class CreateSupplierService {
    async execute(data: ISupplier) {
        // Validação com Zod
        const parsed = createSupplierSchema.safeParse(data);

        if (!parsed.success) {
            throw new BadRequestException(
                parsed.error.errors[0].message,
                ErrorCodes.VALIDATION_ERROR
            );
        }

        // Verificar se fornecedor já existe
        const existingSupplier = await prismaClient.supplier.findFirst({
            where: { name: parsed.data.name },
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
                    name: parsed.data.name
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
