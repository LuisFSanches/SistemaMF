import { ISwitchStore } from "../../interfaces/ISwitchStore";
import prismaClient from "../../prisma";
import { ErrorCodes } from "../../exceptions/root";
import { switchStoreSchema } from "../../schemas/admin/switchStore";
import { BadRequestException } from "../../exceptions/bad-request";
import * as jwt from 'jsonwebtoken';

class SwitchStoreService {
    async execute(data: ISwitchStore, sysAdminId: string) {
        // 1. Validação com Zod
        const parsed = switchStoreSchema.safeParse(data);

        if (!parsed.success) {
            throw new BadRequestException(
                parsed.error.errors[0].message,
                ErrorCodes.VALIDATION_ERROR
            );
        }

        // 2. Verificar se o SYS_ADMIN existe e tem a role correta
        const sysAdmin = await prismaClient.admin.findFirst({
            where: { 
                id: sysAdminId,
                role: 'SYS_ADMIN'
            },
        });

        if (!sysAdmin) {
            throw new BadRequestException(
                "SYS_ADMIN not found or invalid role",
                ErrorCodes.UNAUTHORIZED
            );
        }

        // 3. Verificar se a loja existe e está ativa
        const store = await prismaClient.store.findFirst({
            where: { 
                id: data.store_id,
                is_active: true
            },
        });

        if (!store) {
            throw new BadRequestException(
                "Store not found or inactive",
                ErrorCodes.USER_NOT_FOUND
            );
        }

        // 4. Buscar dados completos da loja
        const storeData = await prismaClient.store.findFirst({
            where: {
                id: data.store_id
            },
            select: {
                id: true,
                name: true,
                slug: true,
                is_active: true,
                phone_number: true,
                email: true,
                logo: true,
                banner: true,
                banner_2: true,
                banner_3: true,
                instagram: true,
                facebook: true,
                youtube: true,
                description: true,
                payment_enabled: true,
                google_rating_value: true,
                google_rating_count: true,
                addresses: {
                    select: {
                        id: true,
                        street: true,
                        street_number: true,
                        complement: true,
                        neighborhood: true,
                        city: true,
                        state: true,
                        postal_code: true,
                        country: true,
                        is_main: true,
                    }
                },
                schedules: {
                    select: {
                        id: true,
                        day_of_week: true,
                        opening_time: true,
                        closing_time: true,
                        is_closed: true,
                        lunch_break_start: true,
                        lunch_break_end: true,
                    }
                }
            }
        });

        if (!storeData) {
            throw new BadRequestException(
                "Store data not found",
                ErrorCodes.USER_NOT_FOUND
            );
        }

        // 5. Gerar novo token JWT como se o SYS_ADMIN estivesse logado nessa loja
        try {
            const token = jwt.sign({
                id: sysAdmin.id,
                role: sysAdmin.role,
                store_id: store.id
            }, process.env.JWT_SECRET!, {
                expiresIn: '1y'
            });

            // 6. Retornar dados do SYS_ADMIN com os dados da loja selecionada
            return {
                admin: {
                    id: sysAdmin.id,
                    name: sysAdmin.name,
                    username: sysAdmin.username,
                    role: sysAdmin.role,
                    email: sysAdmin.email,
                    store_id: store.id,
                    created_at: sysAdmin.created_at,
                    updated_at: sysAdmin.updated_at,
                },
                store: storeData,
                token
            };
        } catch (error: any) {
            console.error("[SwitchStoreService] Failed:", error);

            throw new BadRequestException(
                error.message,
                ErrorCodes.SYSTEM_ERROR
            );
        }
    }
}

export { SwitchStoreService };
