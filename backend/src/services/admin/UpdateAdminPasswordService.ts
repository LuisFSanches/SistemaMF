import prismaClient from "../../prisma";
import { hash } from 'bcrypt';
import { ErrorCodes } from "../../exceptions/root";
import { BadRequestException } from "../../exceptions/bad-request";
import { updateAdminPasswordSchema } from "../../schemas/admin/updateAdminPassword";

interface IUpdateAdminPassword {
    admin_id: string;
    new_password: string;
}

class UpdateAdminPasswordService {
    async execute({ admin_id, new_password }: IUpdateAdminPassword) {
        // 1. Validação com Zod
        const parsed = updateAdminPasswordSchema.safeParse({ admin_id, new_password });

        if (!parsed.success) {
            throw new BadRequestException(
                parsed.error.errors[0].message,
                ErrorCodes.VALIDATION_ERROR
            );
        }

        // 2. Verificar se o admin existe
        const admin = await prismaClient.admin.findFirst({
            where: { id: admin_id },
        });

        if (!admin) {
            throw new BadRequestException(
                "Admin not found",
                ErrorCodes.USER_NOT_FOUND
            );
        }

        // 3. Hash da nova senha
        const hashedPassword = await hash(new_password, 10);

        // 4. Atualizar senha no banco
        try {
            const updatedAdmin = await prismaClient.admin.update({
                where: { id: admin_id },
                data: {
                    password: hashedPassword,
                    updated_at: new Date()
                },
                select: {
                    id: true,
                    name: true,
                    username: true,
                    role: true,
                    email: true,
                    store_id: true,
                    updated_at: true
                }
            });

            return updatedAdmin;
        } catch (error: any) {
            console.error("[UpdateAdminPasswordService] Failed:", error);

            throw new BadRequestException(
                error.message,
                ErrorCodes.SYSTEM_ERROR
            );
        }
    }
}

export { UpdateAdminPasswordService };
