import { IRequestVerification } from "../../interfaces/IVerificationCode";
import prismaClient from "../../prisma";
import { ErrorCodes } from "../../exceptions/root";
import { requestVerificationSchema } from "../../schemas/client/requestVerification";
import { BadRequestException } from "../../exceptions/bad-request";
import { EmailService } from "../email/EmailService";

class RequestVerificationService {
    async execute({ phone_number, email }: IRequestVerification) {
        // 1. Validação com Zod
        const parsed = requestVerificationSchema.safeParse({ phone_number, email });

        if (!parsed.success) {
            throw new BadRequestException(
                parsed.error.errors[0].message,
                ErrorCodes.VALIDATION_ERROR
            );
        }

        try {
            // 2. Verificar se o cliente existe
            const client = await prismaClient.client.findFirst({
                where: { 
                    phone_number,
                },
            });

            // Se cliente não existe, retorna informando para seguir sem verificação
            if (!client) {
                return {
                    client_exists: false,
                    message: "Client not found. Proceed without verification.",
                };
            }

            // 3. Se o cliente não tem email cadastrado, verificar e salvar o email informado
            if (!client.email) {
                // Verificar se o email já está em uso por outro cliente
                const existingClient = await prismaClient.client.findFirst({
                    where: { 
                        email,
                        id: { not: client.id }
                    },
                });

                // Só atualiza se o email não estiver em uso
                if (!existingClient) {
                    await prismaClient.client.update({
                        where: { id: client.id },
                        data: { email },
                    });
                }
            }

            // 4. Gerar código de 6 dígitos
            const code = Math.floor(100000 + Math.random() * 900000).toString();

            // 5. Calcular tempo de expiração (15 minutos)
            const expiresAt = new Date();
            expiresAt.setMinutes(expiresAt.getMinutes() + 15);

            // 6. Salvar código no banco
            await prismaClient.verificationCode.create({
                data: {
                    client_id: client.id,
                    code,
                    expires_at: expiresAt,
                },
            });

            // 7. Enviar email com código
            const emailService = new EmailService();
            await emailService.sendVerificationCodeEmail(
                email,
                code,
                client.first_name
            );

            console.log(`[RequestVerificationService] Code sent to ${email} for client ${client.id}`);

            // 8. Retornar apenas o primeiro nome do cliente
            return {
                client_exists: true,
                first_name: client.first_name,
                message: "Verification code sent to email",
            };

        } catch (error: any) {
            console.error("[RequestVerificationService] Failed:", error);

            if (error instanceof BadRequestException) {
                throw error;
            }

            throw new BadRequestException(
                error.message || "Failed to request verification",
                ErrorCodes.SYSTEM_ERROR
            );
        }
    }
}

export { RequestVerificationService };
