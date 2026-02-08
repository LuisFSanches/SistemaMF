import prismaClient from "../../prisma";
import { BadRequestException } from "../../exceptions/bad-request";
import { ErrorCodes } from "../../exceptions/root";
import { maskPaymentCredentials } from "../../utils/maskSensitiveData";
import fs from "fs";
import path from "path";
import { storesUploadDir } from "../../config/paths";

interface IGetStore {
    id?: string;
    slug?: string;
}

class GetStoreService {
    private async convertLogoToBase64(logoUrl: string): Promise<string | null> {
        try {
            let logoBuffer: Buffer;
            let logoExtension: string;

            // Verificar se é uma URL (Cloudflare R2) ou caminho local
            if (logoUrl.startsWith('http://') || logoUrl.startsWith('https://')) {
                // Download da imagem do Cloudflare R2
                const response = await fetch(logoUrl);
                if (response.ok) {
                    const arrayBuffer = await response.arrayBuffer();
                    logoBuffer = Buffer.from(arrayBuffer);
                    
                    // Extrair extensão da URL
                    const urlPath = new URL(logoUrl).pathname;
                    logoExtension = path.extname(urlPath).toLowerCase();
                } else {
                    throw new Error(`Failed to fetch logo from URL: ${response.status}`);
                }
            } else {
                // Caminho local
                const logoPath = path.join(storesUploadDir, logoUrl);
                if (fs.existsSync(logoPath)) {
                    logoBuffer = fs.readFileSync(logoPath);
                    logoExtension = path.extname(logoUrl).toLowerCase();
                } else {
                    throw new Error('Logo file not found locally');
                }
            }

            // Determinar o tipo MIME
            let mimeType = 'image/jpeg';
            if (logoExtension === '.png') {
                mimeType = 'image/png';
            } else if (logoExtension === '.jpg' || logoExtension === '.jpeg') {
                mimeType = 'image/jpeg';
            } else if (logoExtension === '.webp') {
                mimeType = 'image/webp';
            } else if (logoExtension === '.gif') {
                mimeType = 'image/gif';
            }
            
            return `data:${mimeType};base64,${logoBuffer!.toString('base64')}`;
        } catch (error) {
            console.error("[GetStoreService] Failed to convert logo to base64:", error);
            return null;
        }
    }

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

            // Converter logo para base64 se existir
            const logoBase64 = store.logo ? await this.convertLogoToBase64(store.logo) : null;

            return {
                ...store,
                ...maskedCredentials,
                logo_base64: logoBase64,
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
