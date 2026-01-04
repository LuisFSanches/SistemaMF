import prismaClient from "../../prisma";
import { compare } from 'bcrypt';
import { ErrorCodes } from "../../exceptions/root";
import { BadRequestException } from "../../exceptions/bad-request";
import { UnauthorizedRequestException } from "../../exceptions/unauthorized";
import { updateAdminEmailSchema } from "../../schemas/admin/updateAdminEmail";

interface IUpdateAdminEmail {
    admin_id: string;
    email: string;
    current_password: string;
}

class UpdateAdminEmailService {
    async execute({ admin_id, email, current_password }: IUpdateAdminEmail) {
        // 1. Validação com Zod
        const parsed = updateAdminEmailSchema.safeParse({ email, current_password });

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

        // 3. Validar senha atual
        const isPasswordValid = await compare(current_password, admin.password);

        if (!isPasswordValid) {
            throw new UnauthorizedRequestException(
                "Invalid password",
                ErrorCodes.INCORRECT_PASSWORD
            );
        }

        // 4. Verificar se o email já está em uso por outro admin
        const emailExists = await prismaClient.admin.findFirst({
            where: {
                email,
                NOT: {
                    id: admin_id
                }
            },
        });

        if (emailExists) {
            throw new BadRequestException(
                "Email already in use",
                ErrorCodes.USER_ALREADY_EXISTS
            );
        }

        // 5. Atualizar email no banco
        try {
            const updatedAdmin = await prismaClient.admin.update({
                where: { id: admin_id },
                data: {
                    email,
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
            console.error("[UpdateAdminEmailService] Failed:", error);

            throw new BadRequestException(
                error.message,
                ErrorCodes.SYSTEM_ERROR
            );
        }
    }
}

export { UpdateAdminEmailService };
