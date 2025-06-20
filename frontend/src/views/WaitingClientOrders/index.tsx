import { useEffect, useState } from "react";
import { OrderDetailModal } from "../../components/OrderDetailModal";
import { ConfirmPopUp } from "../../components/ConfirmPopUp";
import { IOrder } from "../../interfaces/IOrder";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faTrash } from "@fortawesome/free-solid-svg-icons";
import { Container } from "./style";
import { PageHeader } from "../../styles/global";
import { useOrders } from "../../contexts/OrdersContext";
import { formatTitleCase } from "../../utils";
import { deleteOrder } from '../../services/orderService';

export function WaitingClientOrders(){
    const { waitingOrders, loadWaitingOrders } = useOrders();
    const [orderDetailModal, setOrderDetailModal] = useState(false);
    const [deleteOrderModal, setDeleteOrderModal] = useState(false);
    const [currentOrder, setCurrentOrder] = useState<IOrder | null>(null);

    function handleOpenOrderDetailModal(order: IOrder){
        setOrderDetailModal(true);
        setCurrentOrder(order);
    }

    function handleCloseOrderDetailModal(){
        setOrderDetailModal(false);
    }

    function handleOpenConfirmPopUp(order: IOrder){
        setDeleteOrderModal(true);
        setCurrentOrder(order);
    }

    async function handleDeleteOrder(){
        console.log(currentOrder);
        await deleteOrder(currentOrder?.id as string);
        setDeleteOrderModal(false);
        loadWaitingOrders();
    }

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
                        <th>Telefone</th>
                        <th>Total</th>
                        <th>Visualizar</th>
                        <th>Deletar</th>
                    </tr>
                </thead>
                <tbody>
                    {waitingOrders.length > 0 && waitingOrders?.map(order => (
                        <>
                            <tr key={order.id}>
                                <td>#{order.code}</td>
                                <td>{formatTitleCase(order.description)}</td>
                                <td>{order.receiver_phone}</td>
                                <td>R$ {order.total}</td>
                                <td className="table-icon">
                                    <button className="view-button" onClick={() => handleOpenOrderDetailModal(order)}>
                                        <FontAwesomeIcon icon={faEye}/>
                                    </button>
                                </td>
                                <td className="table-icon">
                                    <button className="del-button" onClick={() => handleOpenConfirmPopUp(order)}>
                                        <FontAwesomeIcon icon={faTrash}/>
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
                isOnlineOrder={true}
            />

            <ConfirmPopUp isOpen={deleteOrderModal}
                onRequestClose={() => setDeleteOrderModal(false)}
                handleAction={handleDeleteOrder}
                label="Remove Pedido"
            />
        </Container>
    )
}
