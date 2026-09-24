import { IRequestVerification } from "../../interfaces/IVerificationCode";
import prismaClient from "../../prisma";
import { ErrorCodes } from "../../exceptions/root";
import { requestVerificationSchema } from "../../schemas/client/requestVerification";
import { BadRequestException } from "../../exceptions/bad-request";
import { EmailService } from "../email/EmailService";

class ResendVerificationCodeEmailService {
    async execute({ phone_number, email }: IRequestVerification) {
        const parsed = requestVerificationSchema.safeParse({ phone_number, email });

        if (!parsed.success) {
            throw new BadRequestException(
                parsed.error.errors[0].message,
                ErrorCodes.VALIDATION_ERROR
            );
        }

        try {
            const client = await prismaClient.client.findFirst({
                where: { phone_number },
            });

            if (!client) {
                throw new BadRequestException(
                    "Client not found",
                    ErrorCodes.USER_NOT_FOUND
                );
            }

            // Reutiliza o código de verificação válido mais recente, ou gera um novo caso não exista/expirou
            let verificationCode = await prismaClient.verificationCode.findFirst({
                where: {
                    client_id: client.id,
                    is_used: false,
                    expires_at: {
                        gte: new Date(),
                    },
                },
                orderBy: {
                    created_at: 'desc',
                },
            });

            if (!verificationCode) {
                const code = Math.floor(100000 + Math.random() * 900000).toString();
                const expiresAt = new Date();
                expiresAt.setMinutes(expiresAt.getMinutes() + 15);

                verificationCode = await prismaClient.verificationCode.create({
                    data: {
                        client_id: client.id,
                        code,
                        expires_at: expiresAt,
                    },
                });
            }

            if (process.env.IS_PRODUCTION === 'true') {
                const emailService = new EmailService();
                await emailService.sendVerificationCodeEmail(
                    email,
                    verificationCode.code,
                    client.first_name
                );
            } else {
                console.log(`[ResendVerificationCodeEmailService] DEV MODE - Code not sent. Email: ${email}, Code: ${verificationCode.code}, Client: ${client.id}`);
            }

            return {
                client_exists: true,
                first_name: client.first_name,
                sent_via: "email",
                message: "Verification code sent via email",
            };

        } catch (error: any) {
            console.error("[ResendVerificationCodeEmailService] Failed:", error);

            if (error instanceof BadRequestException) {
                throw error;
            }

            throw new BadRequestException(
                error.message || "Failed to resend verification code",
                ErrorCodes.SYSTEM_ERROR
            );
        }
    }
}

export { ResendVerificationCodeEmailService };
