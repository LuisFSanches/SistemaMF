import prismaClient from "../../prisma";
import { BadRequestException } from "../../exceptions/bad-request";
import { ErrorCodes } from "../../exceptions/root";

class GetAllStoresService {
    async execute() {
        try {
            const stores = await prismaClient.store.findMany({
                select: {
                    id: true,
                    name: true,
                    slug: true,
                    cnpj: true,
                    phone_number: true,
                    email: true,
                    description: true,
                    is_active: true,
                    is_first_access: true,
                    payment_enabled: true,
                    logo: true,
                    banner: true,
                    created_at: true,
                    updated_at: true,
                    addresses: {
                        select: {
                            id: true,
                            street: true,
                            street_number: true,
                            complement: true,
                            neighborhood: true,
                            reference_point: true,
                            city: true,
                            state: true,
                            postal_code: true,
                            country: true,
                            is_main: true,
                        },
                    },
                    schedules: {
                        select: {
                            id: true,
                            day_of_week: true,
                            is_closed: true,
                            opening_time: true,
                            closing_time: true,
                            lunch_break_start: true,
                            lunch_break_end: true,
                        },
                    },
                    // Não retornar credenciais sensíveis
                },
                orderBy: {
                    created_at: 'desc',
                },
            });

            return stores;
        } catch (error: any) {
            console.error("[GetAllStoresService] Failed:", error);

            throw new BadRequestException(
                error.message,
                ErrorCodes.SYSTEM_ERROR
            );
        }
    }
}

export { GetAllStoresService };
