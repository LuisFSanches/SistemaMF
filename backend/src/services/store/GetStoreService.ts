import prismaClient from "../../prisma";
import { BadRequestException } from "../../exceptions/bad-request";
import { ErrorCodes } from "../../exceptions/root";
import { maskPaymentCredentials } from "../../utils/maskSensitiveData";

interface IGetStore {
    id?: string;
    slug?: string;
}

class GetStoreService {
    async execute({ id, slug }: IGetStore) {
        if (!id && !slug) {
            throw new BadRequestException(
                "Store ID or slug is required",
                ErrorCodes.BAD_REQUEST
            );
        }

        try {
            const store = await prismaClient.store.findFirst({
                where: id ? { id } : { slug },
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
                    banner_2: true,
                    banner_3: true,
                    // Credenciais de pagamento (serão mascaradas)
                    mp_access_token: true,
                    mp_public_key: true,
                    mp_seller_id: true,
                    mp_webhook_secret: true,
                    inter_client_id: true,
                    inter_client_secret: true,
                    inter_api_cert_path: true,
                    inter_api_key_path: true,
                    created_at: true,
                    updated_at: true,
                    facebook: true,
                    instagram: true,
                    youtube: true,
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
                            created_at: true,
                            updated_at: true,
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
                            created_at: true,
                            updated_at: true,
                        },
                        orderBy: {
                            day_of_week: 'asc',
                        },
                    },
                    holidays: {
                        select: {
                            id: true,
                            date: true,
                            name: true,
                            description: true,
                            is_closed: true,
                            created_at: true,
                            updated_at: true,
                        },
                        orderBy: {
                            date: 'asc',
                        },
                    },
                    // Não retornar credenciais sensíveis
                },
            });

            if (!store) {
                throw new BadRequestException(
                    "Store not found",
                    ErrorCodes.USER_NOT_FOUND
                );
            }

            // Mascara os dados sensíveis antes de retornar
            const maskedCredentials = maskPaymentCredentials({
                mp_access_token: store.mp_access_token,
                mp_public_key: store.mp_public_key,
                mp_seller_id: store.mp_seller_id,
                mp_webhook_secret: store.mp_webhook_secret,
                inter_client_id: store.inter_client_id,
                inter_client_secret: store.inter_client_secret,
                inter_api_cert_path: store.inter_api_cert_path,
                inter_api_key_path: store.inter_api_key_path,
            });

            return {
                ...store,
                ...maskedCredentials,
            };
        } catch (error: any) {
            console.error("[GetStoreService] Failed:", error);

            if (error instanceof BadRequestException) {
                throw error;
            }

            throw new BadRequestException(
                error.message,
                ErrorCodes.SYSTEM_ERROR
            );
        }
    }
}

export { GetStoreService };
