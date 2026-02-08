import prismaClient from "../../prisma";
import { ErrorCodes } from "../../exceptions/root";
import { BadRequestException } from "../../exceptions/bad-request";

class GetAllStoresForSysAdminService {
    async execute() {
        try {
            // Buscar todas as lojas do sistema com informações relevantes
            const stores = await prismaClient.store.findMany({
                orderBy: {
                    name: 'asc'
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
                    created_at: true,
                    updated_at: true,
                    _count: {
                        select: {
                            admins: true,
                            storeProducts: true,
                        }
                    }
                },
            });

            return stores;
        } catch (error: any) {
            console.error("[GetAllStoresForSysAdminService] Failed:", error);

            throw new BadRequestException(
                error.message,
                ErrorCodes.SYSTEM_ERROR
            );
        }
    }
}

export { GetAllStoresForSysAdminService };
