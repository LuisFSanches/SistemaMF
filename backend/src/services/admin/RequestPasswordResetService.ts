import prismaClient from "../../prisma";
import { ErrorCodes } from "../../exceptions/root";
import { BadRequestException } from "../../exceptions/bad-request";
import { requestPasswordResetSchema } from "../../schemas/admin/requestPasswordReset";
import { EmailService } from "../email/EmailService";
import crypto from 'crypto';

interface IRequestPasswordReset {
    email: string;
}

class RequestPasswordResetService {
    async execute({ email }: IRequestPasswordReset) {
        // 1. Validação com Zod
        const parsed = requestPasswordResetSchema.safeParse({ email });

        if (!parsed.success) {
            throw new BadRequestException(
                parsed.error.errors[0].message,
                ErrorCodes.VALIDATION_ERROR
            );
        }

        // 2. Verificar se existe admin com este email
        const admin = await prismaClient.admin.findFirst({
            where: { 
                email: email.toLowerCase() 
            },
        });

        if (!admin) {
            // Por segurança, não revelamos se o email existe ou não
            // Retornamos sucesso mesmo se não encontrar
            return { 
                success: true, 
                message: "If this email is registered, you will receive a password reset link." 
            };
        }

        // 3. Gerar token único
        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetTokenExpires = new Date(Date.now() + 3600000); // 1 hora

        // 4. Salvar token no banco
        try {
            await prismaClient.admin.update({
                where: { id: admin.id },
                data: {
                    reset_password_token: resetToken,
                    reset_password_expires: resetTokenExpires,
                    updated_at: new Date()
                }
            });

            // 5. Enviar email
            const emailService = new EmailService();
            await emailService.sendPasswordResetEmail(
                admin.email!,
                resetToken,
                admin.name
            );

            console.log(`[RequestPasswordResetService] Reset email sent to ${admin.email}`);

            return { 
                success: true, 
                message: "Password reset link has been sent to your email." 
            };

        } catch (error: any) {
            console.error("[RequestPasswordResetService] Failed:", error);

            throw new BadRequestException(
                "Failed to send password reset email",
                ErrorCodes.SYSTEM_ERROR
            );
        }
    }
}

export { RequestPasswordResetService };
