import prismaClient from '../../prisma';
import { startOfDay, startOfWeek, startOfMonth, startOfYear, subHours } from 'date-fns'

type Period = 'day' | 'week' | 'month' | 'year'

export class DashboardService {
    static async getDashboardData(period: Period, store_id?: string) {
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
                store_id: store_id ? store_id : undefined,
            },
        })

        // Filtra pedidos cancelados para as estatísticas principais
        const ordersWithoutCanceled = orders.filter((o) =>
            o.status !== 'CANCELED' && o.status !== 'PENDING_PAYMENT')

        const totalAmount = ordersWithoutCanceled.reduce((acc, order) => acc + order.total, 0)
        const amountReceived = ordersWithoutCanceled
            .filter((o) => o.payment_received)
            .reduce((acc, order) => acc + order.total, 0)
        const amountPending = totalAmount - amountReceived

        const inStoreOrders = ordersWithoutCanceled.filter((o) => !o.online_order && !o.store_front_order).length
        const whatsAppOrders = ordersWithoutCanceled.filter((o) => o.online_order && !o.store_front_order).length
        const onlineOrders = ordersWithoutCanceled
            .filter((o) => o.store_front_order && o.status !== 'PENDING_PAYMENT').length

        const totalOrders = inStoreOrders + whatsAppOrders + onlineOrders;

        // Contagem de métodos de pagamento
        const paymentMethods = {
            CASH: orders.filter((o) =>
                o.payment_method === 'CASH' || o.payment_method === 'MercadoPago - account_money').length,
            PIX: orders.filter((o) =>
                o.payment_method === 'PIX'
                || o.payment_method === 'MercadoPago - bank_transfer').length,
            CARD: orders.filter((o) =>
                o.payment_method === 'CARD'
                || o.payment_method === 'MercadoPago - credit_card').length,
        }

        // Top administradores (filtra pedidos online sem admin)
        const topAdmins = await prismaClient.order.groupBy({
            by: ['created_by'],
            where: {
                created_at: {
                    gte: startDate,
                    lte: now,
                },
                created_by: {
                    not: null,
                },
                store_id: store_id ? store_id : undefined,
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
                id: { in: topAdmins.map((admin) => admin.created_by).filter((id): id is string => id !== null) },
                store_id: store_id ? store_id : undefined,
            },
            select: {
                id: true,
                name: true,
                username: true,
            },
        })

        const admins = topAdmins
            .filter((admin) => admin.created_by !== null)
            .map((admin) => {
                const adminData = adminsDetails.find((a) => a.id === admin.created_by)
                return {
                    id: admin.created_by!,
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
            whatsAppOrders,
            onlineOrders,
            paymentMethods,
            admins,
        }
    }
}
