import { TableContainer, Table, Th, Td } from './style'
import { STATUS_LABEL } from "../../constants";
import { Status } from '../../interfaces/IStatus';

export function OrdersTable({ orders }: { orders: any[] }) {
    return (
        <TableContainer>
            <Table>
                <thead>
                    <tr>
                        <Th>Código</Th>
                        <Th>Cliente</Th>
                        <Th>Total</Th>
                        <Th>Status</Th>
                        <Th>Data</Th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map((order) => (
                        <tr key={order.id}>
                            <Td>#{order.code}</Td>
                            <Td>{order.receiver_name ?? '---'}</Td>
                            <Td>R$ {order.total.toFixed(2)}</Td>
                            <Td>
                                <span className={order.status}>
                                    {STATUS_LABEL[order.status as Status]}
                                </span>
                            </Td>
                            <Td>{new Date(order.created_at).toLocaleDateString()}</Td>
                        </tr>
                    ))}
                </tbody>
            </Table>
            <a href="/pedidos" style={{ display: 'block' }}>
                Ver todos os pedidos
            </a>
        </TableContainer>
    )
}
