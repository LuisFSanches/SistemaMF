import { useEffect } from "react";
import { Container } from "./style";
import { PageHeader } from "../../styles/global";
import { useOrders } from "../../contexts/OrdersContext";
import { formatTitleCase } from "../../utils";

export function WaitingClientOrders(){
    const { waitingOrders, loadWaitingOrders } = useOrders();

    useEffect(() => {
        loadWaitingOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return(
        <Container>
            <PageHeader>
                <h1>Pedidos Aguardando Preenchimento do Cliente</h1>
            </PageHeader>
            <table>
                <thead className="head">
                    <tr>
                        <th>Pedido</th>
                        <th>Descrição</th>
                        <th>Total</th>
                    </tr>
                </thead>
                <tbody>
                    {waitingOrders.length > 0 && waitingOrders?.map(order => (
                        <>
                            <tr key={order.id}>
                                <td>#{order.code}</td>
                                <td>{formatTitleCase(order.description)}</td>
                                <td>R$ {order.total}</td>
                            </tr>
                        </>
                    ))}
                </tbody>
            </table>
        </Container>
    )
}
