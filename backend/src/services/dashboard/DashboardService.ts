import prismaClient from '../../prisma';

export class DashboardService {
    static async getDashboardData(startDate: Date, endDate: Date, store_id?: string) {
        // Não ajustar as datas - já vêm corretas em UTC do controller
        // startDate = 2026-05-04T00:00:00.000Z
        // endDate = 2026-05-04T23:59:59.999Z

        const orders = await prismaClient.order.findMany({
            where: {
                created_at: {
                    gte: startDate,
                    lte: endDate,
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
                    lte: endDate,
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
