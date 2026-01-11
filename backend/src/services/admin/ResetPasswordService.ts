import prismaClient from "../../prisma";
import { hash } from 'bcrypt';
import { ErrorCodes } from "../../exceptions/root";
import { BadRequestException } from "../../exceptions/bad-request";
import { resetPasswordSchema } from "../../schemas/admin/resetPassword";

interface IResetPassword {
    token: string;
    new_password: string;
}

class ResetPasswordService {
    async execute({ token, new_password }: IResetPassword) {
        // 1. Validação com Zod
        const parsed = resetPasswordSchema.safeParse({ token, new_password });

        if (!parsed.success) {
            throw new BadRequestException(
                parsed.error.errors[0].message,
                ErrorCodes.VALIDATION_ERROR
            );
        }

        // 2. Buscar admin pelo token
        const admin = await prismaClient.admin.findFirst({
            where: {
                reset_password_token: token,
            },
        });

        if (!admin) {
            throw new BadRequestException(
                "Invalid or expired reset token",
                ErrorCodes.BAD_REQUEST
            );
        }

        // 3. Verificar se o token não expirou
        if (!admin.reset_password_expires || admin.reset_password_expires < new Date()) {
            throw new BadRequestException(
                "Reset token has expired",
                ErrorCodes.BAD_REQUEST
            );
        }

        // 4. Hash da nova senha
        const hashedPassword = await hash(new_password, 10);

        // 5. Atualizar senha e limpar token
        try {
            const updatedAdmin = await prismaClient.admin.update({
                where: { id: admin.id },
                data: {
                    password: hashedPassword,
                    reset_password_token: null,
                    reset_password_expires: null,
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

            console.log(`[ResetPasswordService] Password reset successfully for admin ${admin.id}`);

            return {
                success: true,
                message: "Password has been reset successfully",
                admin: updatedAdmin
            };

        } catch (error: any) {
            console.error("[ResetPasswordService] Failed:", error);

            throw new BadRequestException(
                error.message,
                ErrorCodes.SYSTEM_ERROR
            );
        }
    }
}

export { ResetPasswordService };
