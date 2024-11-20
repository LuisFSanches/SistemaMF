import { useState } from "react";
import { IOrder } from "../../interfaces/IOrder";
import { Container } from "./style";
import { PageHeader } from "../../styles/global";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash, faEye, faPlus, faPen } from "@fortawesome/free-solid-svg-icons";
import { OrderDetailModal } from "../../components/OrderDetailModal";
import { useOrders } from "../../contexts/OrdersContext";
import { STATUS_LABEL } from "../../constants";


export function OrdersPage(){
    const { orders } = useOrders();

    const [orderDetailModal, setOrderDetailModal] = useState(false);
    const [currentOrder, setCurrentOrder] = useState<IOrder | null>(null);

    function handleOpenOrderDetailModal(order: IOrder){
        setOrderDetailModal(true);
        setCurrentOrder(order);
    }
    function handleCloseOrderDetailModal(){
        setOrderDetailModal(false);
    }

    return(
        <Container>
            <PageHeader>
            	<h1>Pedidos</h1>
            </PageHeader>
            <table>
                <thead className="head">
                    <tr>
                        <th>Pedido</th>
                        <th>Descrição</th>
                        <th>Cliente</th>
                        <th>Status</th>
                        <th>Total</th>
                        <th>Visualizar</th>
                    </tr>
                </thead>
                <tbody>
                    {orders?.map(order => (
                        <>
                            <tr key={order.id}>
                                <td>#{order.code}</td>
                                <td>{order.description}</td>
                                <td>{order.client.first_name} {order.client.last_name}</td>
                                <td>{STATUS_LABEL[order.status]}</td>
                                <td>R$ {order.total}</td>

                                <td className="table-icon">
                                    <button className="view-button" onClick={() => handleOpenOrderDetailModal(order)}>
                                        <span>Visualizar</span> <FontAwesomeIcon icon={faEye}/>
                                    </button>
                                </td>
                            </tr>
                        </>
                    ))}
                </tbody>
            </table>

            <OrderDetailModal
                isOpen={orderDetailModal}
                onRequestClose={handleCloseOrderDetailModal}
                order={currentOrder as any}
            />
        </Container>
    )
}
