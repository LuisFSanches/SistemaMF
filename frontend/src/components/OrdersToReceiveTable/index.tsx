import { useState } from "react";
import moment from "moment";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPen, faCheck, faEnvelopeCircleCheck, faTrash, faBoxOpen } from "@fortawesome/free-solid-svg-icons";
import { IOrderToReceive } from "../../interfaces/IOrderToReceive";
import { convertMoney } from "../../utils";
import { ConfirmPopUp } from "../ConfirmPopUp";
import { NewOrderToReceiveModal } from "../NewOrderToReceiveModal";
import { useOrdersToReceive } from "../../contexts/OrdersToReceiveContext";
import { useSuccessMessage } from "../../contexts/SuccessMessageContext";
import { updateOrderPaymentStatus } from "../../services/orderService";
import { ORDERS_TO_RECEIVE_TYPES } from "../../constants";
import {
    Container,
    StatusBadge,
    TypeBadge,
    ActionsContainer,
    EmptyState
} from "./style";

interface OrdersToReceiveTableProps {
    orders: IOrderToReceive[];
    filter: 'active' | 'archived' | 'all';
    page: number;
    pageSize: number;
    query: string;
}

const ORDERS_TO_RECEIVE_TYPES_FORMATTED: Record<string, string> = ORDERS_TO_RECEIVE_TYPES;

export function OrdersToReceiveTable({ orders, filter, page, pageSize, query }: OrdersToReceiveTableProps) {
    const { updateOrderToReceive, deleteOrderToReceive, loadOrdersToReceive } = useOrdersToReceive();
    const { showSuccess } = useSuccessMessage();
    const [confirmReceiveModal, setConfirmReceiveModal] = useState(false);
    const [confirmArchiveModal, setConfirmArchiveModal] = useState(false);
    const [confirmUnarchiveModal, setConfirmUnarchiveModal] = useState(false);
    const [confirmDeleteModal, setConfirmDeleteModal] = useState(false);
    const [editModal, setEditModal] = useState(false);
    const [selectedOrderId, setSelectedOrderId] = useState<string>("");
    const [selectedOrderToReceive, setSelectedOrderToReceive] = useState<IOrderToReceive | null>(null);

    const getStatusLabel = (order: IOrderToReceive) => {
        if (order.received_date || order.order?.payment_received) return "Pago";
        const isOverdue = moment().isAfter(moment(order.payment_due_date));
        return isOverdue ? "Vencido" : "Pendente";
    };

    const isOverdue = (order: IOrderToReceive) => {
        if (order.received_date) return false;
        return moment().isAfter(moment(order.payment_due_date));
    };

    const handleReceive = async () => {
        try {
            const orderToReceive = orders.find(o => o.id === selectedOrderId);
            if (!orderToReceive) return;

            await updateOrderPaymentStatus(orderToReceive.order_id, true);

            await updateOrderToReceive(selectedOrderId, {
                received_date: new Date().toISOString()
            });

            await loadOrdersToReceive(page, pageSize, query, filter);
            setConfirmReceiveModal(false);
            setSelectedOrderId("");
            showSuccess("Pagamento confirmado com sucesso!");
        } catch (error) {
            console.error("Error receiving payment:", error);
            alert("Erro ao receber pagamento. Tente novamente.");
        }
    };

    const handleArchive = async () => {
        try {
            await updateOrderToReceive(selectedOrderId, {
                is_archived: true
            });

            await loadOrdersToReceive(page, pageSize, query, filter);
            setConfirmArchiveModal(false);
            setSelectedOrderId("");
            showSuccess("Pedido arquivado com sucesso!");
        } catch (error) {
            console.error("Error archiving order:", error);
            alert("Erro ao arquivar pedido. Tente novamente.");
        }
    };

    const handleUnarchive = async () => {
        try {
            await updateOrderToReceive(selectedOrderId, {
                is_archived: false
            });

            await loadOrdersToReceive(page, pageSize, query, filter);
            setConfirmUnarchiveModal(false);
            setSelectedOrderId("");
            showSuccess("Pedido desarquivado com sucesso!");
        } catch (error) {
            console.error("Error unarchiving order:", error);
            alert("Erro ao desarquivar pedido. Tente novamente.");
        }
    };

    const handleDelete = async () => {
        try {
            await deleteOrderToReceive(selectedOrderId);
            await loadOrdersToReceive(page, pageSize, query, filter);
            setConfirmDeleteModal(false);
            setSelectedOrderId("");
            showSuccess("Valor a receber deletado com sucesso!");
        } catch (error) {
            console.error("Error deleting order:", error);
            alert("Erro ao deletar pedido. Tente novamente.");
        }
    };

    const filteredOrders = orders || [];


    if (filteredOrders.length === 0) {
        return (
        <Container>
            <EmptyState>
            <h3>Nenhum registro encontrado</h3>
            <p>Não há valores a receber para exibir.</p>
            </EmptyState>
        </Container>
        );
    }

    return (
        <Container>
            <table>
                <thead>
                    <tr>
                        <th>Nº Pedido</th>
                        <th>Cliente</th>
                        <th>Data</th>
                        <th>Vencimento</th>
                        <th>Valor</th>
                        <th>Tipo</th>
                        <th>Status</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredOrders.map((orderToReceive, index) => (
                        <tr 
                        key={orderToReceive.id} 
                        className={isOverdue(orderToReceive) ? 'overdue' : ''}
                        >
                        <td>#{orderToReceive.order?.code}</td>
                        <td>
                            {orderToReceive.order?.client?.first_name} {orderToReceive.order?.client?.last_name}
                        </td>
                        <td>{moment(orderToReceive.order?.created_at).format('DD/MM/YYYY')}</td>
                        <td>{moment(orderToReceive.payment_due_date).format('DD/MM/YYYY')}</td>
                        <td>{convertMoney(orderToReceive.order?.total || 0)}</td>
                        <td>
                            <TypeBadge type={orderToReceive.type}>
                            {ORDERS_TO_RECEIVE_TYPES_FORMATTED[orderToReceive.type] || orderToReceive.type}
                            </TypeBadge>
                        </td>
                        <td>
                            <StatusBadge status={getStatusLabel(orderToReceive)}>
                                {getStatusLabel(orderToReceive)}
                            </StatusBadge>
                        </td>
                        <td>
                            <ActionsContainer>
                                <button className="edit-button"
                                    onClick={() => {
                                        setSelectedOrderToReceive(orderToReceive);
                                        setEditModal(true);
                                    }}
                                    title="Editar"
                                >
                                    <FontAwesomeIcon icon={faPen}/>
                                </button>

                                {!orderToReceive.is_archived ? (
                                    <button className="view-button"
                                        onClick={() => {
                                            setSelectedOrderId(orderToReceive.id!);
                                            setConfirmArchiveModal(true);
                                        }}
                                        title="Arquivar"
                                    >
                                        <FontAwesomeIcon icon={faEnvelopeCircleCheck}/>
                                    </button>
                                ) : (
                                    <button className="view-button"
                                        onClick={() => {
                                            setSelectedOrderId(orderToReceive.id!);
                                            setConfirmUnarchiveModal(true);
                                        }}
                                        title="Desarquivar"
                                    >
                                        <FontAwesomeIcon icon={faBoxOpen}/>
                                    </button>
                                )}

                                {!orderToReceive.received_date && (
                                    <button className="done-button"
                                        onClick={() => {
                                            setSelectedOrderId(orderToReceive.id!);
                                            setConfirmReceiveModal(true);
                                        }}
                                        title="Confirmar Recebimento"
                                    >
                                        <FontAwesomeIcon icon={faCheck}/>
                                    </button>
                                )}

                                <button className="del-button"
                                    onClick={() => {
                                        setSelectedOrderId(orderToReceive.id!);
                                        setConfirmDeleteModal(true);
                                    }}
                                    title="Deletar"
                                >
                                    <FontAwesomeIcon icon={faTrash}/>
                                </button>
                            </ActionsContainer>
                        </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <ConfirmPopUp
                isOpen={confirmReceiveModal}
                onRequestClose={() => {
                    setConfirmReceiveModal(false);
                    setSelectedOrderId("");
                }}
                handleAction={handleReceive}
                actionLabel="Confirmar Recebimento"
                label="Confirmar"
            />

            <ConfirmPopUp
                isOpen={confirmArchiveModal}
                onRequestClose={() => {
                    setConfirmArchiveModal(false);
                    setSelectedOrderId("");
                }}
                handleAction={handleArchive}
                actionLabel="Deseja arquivar este pedido?"
                label="Arquivar"
            />

            <ConfirmPopUp
                isOpen={confirmUnarchiveModal}
                onRequestClose={() => {
                    setConfirmUnarchiveModal(false);
                    setSelectedOrderId("");
                }}
                handleAction={handleUnarchive}
                actionLabel="Deseja desarquivar este pedido?"
                label="Desarquivar"
            />

            <ConfirmPopUp
                isOpen={confirmDeleteModal}
                onRequestClose={() => {
                    setConfirmDeleteModal(false);
                    setSelectedOrderId("");
                }}
                handleAction={handleDelete}
                actionLabel="Tem certeza que deseja deletar este valor a receber?"
                label="Deletar"
            />

            <NewOrderToReceiveModal
                isOpen={editModal}
                onRequestClose={() => {
                    setEditModal(false);
                    setSelectedOrderToReceive(null);
                }}
                action="edit"
                currentOrderToReceive={selectedOrderToReceive}
            />
        </Container>
    );
}
