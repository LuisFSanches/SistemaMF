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
import { DataTable, ColumnDef } from "../../components/DataTable";
import { RowActions, IconButton } from "../../components/DataTable/style";

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
        await deleteOrder(currentOrder?.id as string);
        setDeleteOrderModal(false);
        loadWaitingOrders();
    }

    useEffect(() => {
        loadWaitingOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const columns: ColumnDef<IOrder>[] = [
        {
            key: 'code',
            header: 'Pedido',
            render: (order) => `#${order.code}`,
        },
        {
            key: 'description',
            header: 'Descrição',
            width: '40%',
            render: (order) => formatTitleCase(order.description),
        },
        {
            key: 'phone',
            header: 'Telefone',
            render: (order) => order.receiver_phone,
        },
        {
            key: 'total',
            header: 'Total',
            render: (order) => `R$ ${order.total}`,
        },
        {
            key: 'actions',
            header: 'Ações',
            render: (order) => (
                <RowActions>
                    <IconButton $tone="view" title="Visualizar" onClick={() => handleOpenOrderDetailModal(order)}>
                        <FontAwesomeIcon icon={faEye}/>
                    </IconButton>
                    <IconButton $tone="delete" title="Deletar" onClick={() => handleOpenConfirmPopUp(order)}>
                        <FontAwesomeIcon icon={faTrash}/>
                    </IconButton>
                </RowActions>
            ),
        },
    ];

    return(
        <Container>
            <PageHeader>
                <h1>Pedidos Aguardando Preenchimento do Cliente</h1>
            </PageHeader>

            <DataTable
                columns={columns}
                data={waitingOrders}
                rowKey={(order) => order.id as string}
                emptyTitle="Nenhum pedido aguardando"
                emptyDescription="Não há pedidos aguardando preenchimento do cliente."
            />

            <OrderDetailModal
                isOpen={orderDetailModal}
                onRequestClose={handleCloseOrderDetailModal}
                order={currentOrder as any}
                isOnlineOrder={true}
            />

            <ConfirmPopUp isOpen={deleteOrderModal}
                onRequestClose={() => setDeleteOrderModal(false)}
                handleAction={handleDeleteOrder}
                actionLabel="Tem certeza que quer deletar?"
                label="Remove Pedido"
            />
        </Container>
    )
}
