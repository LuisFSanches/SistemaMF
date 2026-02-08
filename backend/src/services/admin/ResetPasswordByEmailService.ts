import prismaClient from "../../prisma";
import { hash } from 'bcrypt';
import { ErrorCodes } from "../../exceptions/root";
import { BadRequestException } from "../../exceptions/bad-request";
import { resetPasswordByEmailSchema } from "../../schemas/admin/resetPasswordByEmail";

interface IResetPasswordByEmail {
    email: string;
    new_password: string;
}

class ResetPasswordByEmailService {
    async execute({ email, new_password }: IResetPasswordByEmail) {
        // 1. Validação com Zod
        const parsed = resetPasswordByEmailSchema.safeParse({ email, new_password });

        if (!parsed.success) {
            throw new BadRequestException(
                parsed.error.errors[0].message,
                ErrorCodes.VALIDATION_ERROR
            );
        }

        // 2. Buscar admin pelo email
        const admin = await prismaClient.admin.findFirst({
            where: {
                email: email.toLowerCase(),
            },
        });

        if (!admin) {
            throw new BadRequestException(
                "Admin not found with this email",
                ErrorCodes.USER_NOT_FOUND
            );
        }

        // 3. Hash da nova senha
        const hashedPassword = await hash(new_password, 10);

        // 4. Atualizar senha
        try {
            const updatedAdmin = await prismaClient.admin.update({
                where: { id: admin.id },
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

            console.log(`[ResetPasswordByEmailService] Password reset successfully for admin ${admin.id}`);

            return {
                success: true,
                message: `Password has been reset for ${admin.name} (${admin.email})`,
                admin: updatedAdmin
            };

        } catch (error: any) {
            console.error("[ResetPasswordByEmailService] Failed:", error);

            throw new BadRequestException(
                error.message,
                ErrorCodes.SYSTEM_ERROR
            );
        }
    }
}

export { ResetPasswordByEmailService };
