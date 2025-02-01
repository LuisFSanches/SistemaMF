import prismaClient from '../../prisma';
import { ErrorCodes } from "../../exceptions/root";

class TopAdminsService {
    async execute() {
        try {
            const topAdmins = await prismaClient.order.groupBy({
                by: ['created_by'],
                _count: {
                    id: true
                },
                orderBy: {
                    _count: {
                        id: 'desc'
                    }
                },
            });

            const adminsDetails = await prismaClient.admin.findMany({
                where: {
                    id: { in: topAdmins.map(admin => admin.created_by) }
                },
                select: {
                    id: true,
                    name: true,
                    username: true
                }
            });

            const result = topAdmins.map(admin => {
                const adminData = adminsDetails.find(a => a.id === admin.created_by);
                return {
                    id: admin.created_by,
                    name: adminData?.name || 'Unknown',
                    username: adminData?.username || 'Unknown',
                    orders_count: admin._count.id
                };
            });

            return result;
        } catch (error: any) {
            return { error: true, message: error.message, code: ErrorCodes.SYSTEM_ERROR }
        }
    }
}

export { TopAdminsService };
