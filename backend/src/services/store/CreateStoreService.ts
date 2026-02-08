import { IStore } from "../../interfaces/IStore";
import prismaClient from "../../prisma";
import { ErrorCodes } from "../../exceptions/root";
import { createStoreSchema } from "../../schemas/store/createStore";
import { BadRequestException } from "../../exceptions/bad-request";
import { hash } from "bcrypt";
import crypto from "crypto";
import { SendWelcomeEmailService } from "../email/SendWelcomeEmailService";

class CreateStoreService {
    async execute(data: IStore) {
        // Validação com Zod
        const parsed = createStoreSchema.safeParse(data);

        if (!parsed.success) {
            throw new BadRequestException(
                parsed.error.errors[0].message,
                ErrorCodes.VALIDATION_ERROR
            );
        }

        // Verificar se slug já existe
        const existingSlug = await prismaClient.store.findFirst({
            where: { slug: data.slug },
        });

        if (existingSlug) {
            throw new BadRequestException(
                "Uma loja com este slug já está cadastrada. Por favor, escolha outro identificador único para sua loja.",
                ErrorCodes.USER_ALREADY_EXISTS
            );
        }

        // Verificar se email já existe
        const existingEmail = await prismaClient.store.findFirst({
            where: { email: data.email },
        });

        if (existingEmail) {
            throw new BadRequestException(
                "Uma loja com este email já está cadastrada. Por favor, utilize outro endereço de email.",
                ErrorCodes.USER_ALREADY_EXISTS
            );
        }

        // Verificar se CNPJ já existe (se fornecido)
        if (data.cnpj) {
            const existingCNPJ = await prismaClient.store.findFirst({
                where: { cnpj: data.cnpj },
            });

            if (existingCNPJ) {
                throw new BadRequestException(
                    "Uma loja com este CNPJ já está cadastrada. Por favor, verifique se o CNPJ está correto ou utilize outro.",
                    ErrorCodes.USER_ALREADY_EXISTS
                );
            }
        }

        try {
            // Gerar senha aleatória para o Super Admin
            const randomPassword = crypto.randomBytes(8).toString('hex'); // 16 caracteres
            const hashedPassword = await hash(randomPassword, 8);

            // Criar Store e Super Admin em uma transação
            const result = await prismaClient.$transaction(async (prisma) => {
                // Criar a loja
                const store = await prisma.store.create({
                    data: {
                        name: data.name,
                        slug: data.slug,
                        cnpj: data.cnpj,
                        phone_number: data.phone_number,
                        email: data.email,
                        description: data.description,
                        is_active: data.is_active ?? true,
                        is_first_access: true,
                    },
                });

                // Criar Super Admin para a loja
                const admin = await prisma.admin.create({
                    data: {
                        name: data.name,
                        username: data.slug, // Usar slug como username
                        password: hashedPassword,
                        role: "SUPER_ADMIN",
                        store_id: store.id,
                    },
                });

                return { store, admin, temporaryPassword: randomPassword };
            });

            console.log(`[CreateStoreService] Store created: ${result.store.id}`);
            console.log(`[CreateStoreService] Super Admin created: ${result.admin.id}`);
            console.log(`[CreateStoreService] Temporary password: ${result.temporaryPassword}`);

            // Enviar email com as credenciais
            try {
                const sendWelcomeEmailService = new SendWelcomeEmailService();
                await sendWelcomeEmailService.execute({
                    storeName: result.store.name,
                    storeEmail: result.store.email,
                    username: result.admin.username,
                    temporaryPassword: result.temporaryPassword,
                });
                
                console.log(`[CreateStoreService] Welcome email sent to: ${result.store.email}`);
            } catch (emailError: any) {
                console.error("[CreateStoreService] Failed to send welcome email:", emailError.message);
                // Não falha a criação da loja se o email falhar
            }

            // Retornar store com informações do admin e senha temporária
            return {
                store: result.store,
                admin: {
                    id: result.admin.id,
                    name: result.admin.name,
                    username: result.admin.username,
                    role: result.admin.role,
                },
                temporary_password: result.temporaryPassword,
                message: "Store and Super Admin created successfully. Welcome email sent to the store email.",
            };
        } catch (error: any) {
            console.error("[CreateStoreService] Failed:", error);

            throw new BadRequestException(
                error.message,
                ErrorCodes.SYSTEM_ERROR
            );
        }
    }
}

export { CreateStoreService };
