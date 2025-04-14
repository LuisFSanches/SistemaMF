import prismaClient from '../../prisma';
import { startOfDay, startOfWeek, startOfMonth, startOfYear, subHours } from 'date-fns'

type Period = 'day' | 'week' | 'month' | 'year'

export class DashboardService {
    static async getDashboardData(period: Period) {
        const now = new Date()
        let startDate: Date

        switch (period) {
            case 'day':
                startDate = startOfDay(now)
            break
            case 'month':
                startDate = startOfMonth(now)
            break
            case 'year':
                startDate = startOfYear(now)
            break
            case 'week':
            default:
                startDate = startOfWeek(now, { weekStartsOn: 1 })
            break
        }

        const orders = await prismaClient.order.findMany({
            where: {
                created_at: {
                gte: startDate,
                lte: now,
                },
            },
        })

        const totalOrders = orders.length
        const totalAmount = orders.reduce((acc, order) => acc + order.total, 0)
        const amountReceived = orders
            .filter((o) => o.payment_received)
            .reduce((acc, order) => acc + order.total, 0)
        const amountPending = totalAmount - amountReceived

        const inStoreOrders = orders.filter((o) => !o.online_order).length
        const onlineOrders = orders.filter((o) => o.online_order).length

        const recentOrders = orders
            .sort((a, b) => +new Date(b.created_at!) - +new Date(a.created_at!))
            .slice(0, 4)

        // Contagem de métodos de pagamento
        const paymentMethods = {
            CASH: orders.filter((o) => o.payment_method === 'CASH').length,
            PIX: orders.filter((o) => o.payment_method === 'PIX').length,
            CARD: orders.filter((o) => o.payment_method === 'CARD').length,
        }

        // Top administradores
        const topAdmins = await prismaClient.order.groupBy({
            by: ['created_by'],
            where: {
                created_at: {
                    gte: startDate,
                    lte: now,
                },
            },
            _count: {
                id: true,
            },
            orderBy: {
                _count: {
                    id: 'desc',
                },
            },
        })

        const adminsDetails = await prismaClient.admin.findMany({
            where: {
                id: { in: topAdmins.map((admin) => admin.created_by) },
            },
            select: {
                id: true,
                name: true,
                username: true,
            },
        })

        const admins = topAdmins.map((admin) => {
            const adminData = adminsDetails.find((a) => a.id === admin.created_by)
            return {
                id: admin.created_by,
                name: adminData?.name || 'Desconhecido',
                username: adminData?.username || 'Desconhecido',
                orders_count: admin._count.id,
            }
        })

        return {
            totalOrders,
            totalAmount,
            amountReceived,
            amountPending,
            inStoreOrders,
            onlineOrders,
            recentOrders,
            paymentMethods,
            admins,
        }
    }
}
