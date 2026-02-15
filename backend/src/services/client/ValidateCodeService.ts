import { IValidateCode } from "../../interfaces/IVerificationCode";
import prismaClient from "../../prisma";
import { ErrorCodes } from "../../exceptions/root";
import { validateCodeSchema } from "../../schemas/client/validateCode";
import { BadRequestException } from "../../exceptions/bad-request";

class ValidateCodeService {
    async execute({ phone_number, code }: IValidateCode) {
        // 1. Validação com Zod
        const parsed = validateCodeSchema.safeParse({ phone_number, code });

        if (!parsed.success) {
            throw new BadRequestException(
                parsed.error.errors[0].message,
                ErrorCodes.VALIDATION_ERROR
            );
        }

        try {
            // 2. Buscar cliente pelo telefone
            const client = await prismaClient.client.findFirst({
                where: { phone_number },
            });

            if (!client) {
                throw new BadRequestException(
                    "Client not found",
                    ErrorCodes.USER_NOT_FOUND
                );
            }

            // 3. Buscar código de verificação válido
            const verificationCode = await prismaClient.verificationCode.findFirst({
                where: {
                    client_id: client.id,
                    code,
                    is_used: false,
                    expires_at: {
                        gte: new Date(), // Código não expirado
                    },
                },
                orderBy: {
                    created_at: 'desc', // Pegar o mais recente
                },
            });

            if (!verificationCode) {
                throw new BadRequestException(
                    "Invalid or expired verification code",
                    ErrorCodes.VALIDATION_ERROR
                );
            }

            // 4. Marcar código como usado
            await prismaClient.verificationCode.update({
                where: { id: verificationCode.id },
                data: { is_used: true },
            });

            // 5. Retornar dados completos do cliente com endereços
            const clientWithAddresses = await prismaClient.client.findUnique({
                where: { id: client.id },
                include: {
                    addresses: true,
                },
            });

            console.log(`[ValidateCodeService] Code validated successfully for client ${client.id}`);

            return {
                valid: true,
                message: "Code validated successfully",
                client: clientWithAddresses,
            };

        } catch (error: any) {
            console.error("[ValidateCodeService] Failed:", error);

            if (error instanceof BadRequestException) {
                throw error;
            }

            throw new BadRequestException(
                error.message || "Failed to validate code",
                ErrorCodes.SYSTEM_ERROR
            );
        }
    }
}

export { ValidateCodeService };
