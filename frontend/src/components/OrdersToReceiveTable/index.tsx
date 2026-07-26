import { useState } from "react";
import { Link } from "react-router-dom";
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
import { DataTable, ColumnDef } from "../DataTable";
import { RowActions, IconButton } from "../DataTable/style";
import { Badge, BadgeTone } from "../Badge";

interface OrdersToReceiveTableProps {
    orders: IOrderToReceive[];
    filter: 'active' | 'archived' | 'all';
    page: number;
    pageSize: number;
    query: string;
    onQueryChange?: (query: string) => void;
    toolbarExtra?: React.ReactNode;
    footer?: React.ReactNode;
}

const ORDERS_TO_RECEIVE_TYPES_FORMATTED: Record<string, string> = ORDERS_TO_RECEIVE_TYPES;

export function OrdersToReceiveTable({ orders, filter, page, pageSize, query, onQueryChange, toolbarExtra, footer }: OrdersToReceiveTableProps) {
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

    const getStatusTone = (order: IOrderToReceive): BadgeTone => {
        const label = getStatusLabel(order);
        if (label === 'Pago') return 'good';
        if (label === 'Vencido') return 'bad';
        return 'warn';
    };

    const columns: ColumnDef<IOrderToReceive>[] = [
        {
            key: 'order_code',
            header: 'Nº Pedido',
            render: (orderToReceive) => (
                <Link to={`/backoffice/pedido/${orderToReceive.order_id}`} style={{ color: 'var(--dt-accent)', fontWeight: 700, textDecoration: 'none' }}>
                    #{orderToReceive.order?.code}
                </Link>
            ),
        },
        {
            key: 'client',
            header: 'Cliente',
            render: (orderToReceive) => `${orderToReceive.order?.client?.first_name || ''} ${orderToReceive.order?.client?.last_name || ''}`,
        },
        {
            key: 'created_at',
            header: 'Data',
            render: (orderToReceive) => moment(orderToReceive.order?.created_at).format('DD/MM/YYYY'),
        },
        {
            key: 'due_date',
            header: 'Vencimento',
            render: (orderToReceive) => moment(orderToReceive.payment_due_date).format('DD/MM/YYYY'),
        },
        {
            key: 'value',
            header: 'Valor',
            render: (orderToReceive) => convertMoney(orderToReceive.order?.total || 0),
        },
        {
            key: 'type',
            header: 'Tipo',
            render: (orderToReceive) => (
                <Badge tone="info">
                    {ORDERS_TO_RECEIVE_TYPES_FORMATTED[orderToReceive.type] || orderToReceive.type}
                </Badge>
            ),
        },
        {
            key: 'status',
            header: 'Status',
            render: (orderToReceive) => (
                <Badge tone={getStatusTone(orderToReceive)}>
                    {getStatusLabel(orderToReceive)}
                </Badge>
            ),
        },
        {
            key: 'actions',
            header: 'Ações',
            render: (orderToReceive) => (
                <RowActions>
                    <IconButton
                        $tone="edit"
                        title="Editar"
                        onClick={() => {
                            setSelectedOrderToReceive(orderToReceive);
                            setEditModal(true);
                        }}
                    >
                        <FontAwesomeIcon icon={faPen}/>
                    </IconButton>

                    {!orderToReceive.is_archived ? (
                        <IconButton
                            $tone="default"
                            title="Arquivar"
                            onClick={() => {
                                setSelectedOrderId(orderToReceive.id!);
                                setConfirmArchiveModal(true);
                            }}
                        >
                            <FontAwesomeIcon icon={faEnvelopeCircleCheck}/>
                        </IconButton>
                    ) : (
                        <IconButton
                            $tone="default"
                            title="Desarquivar"
                            onClick={() => {
                                setSelectedOrderId(orderToReceive.id!);
                                setConfirmUnarchiveModal(true);
                            }}
                        >
                            <FontAwesomeIcon icon={faBoxOpen}/>
                        </IconButton>
                    )}

                    {!orderToReceive.received_date && (
                        <IconButton
                            $tone="view"
                            title="Confirmar Recebimento"
                            onClick={() => {
                                setSelectedOrderId(orderToReceive.id!);
                                setConfirmReceiveModal(true);
                            }}
                        >
                            <FontAwesomeIcon icon={faCheck}/>
                        </IconButton>
                    )}

                    <IconButton
                        $tone="delete"
                        title="Deletar"
                        onClick={() => {
                            setSelectedOrderId(orderToReceive.id!);
                            setConfirmDeleteModal(true);
                        }}
                    >
                        <FontAwesomeIcon icon={faTrash}/>
                    </IconButton>
                </RowActions>
            ),
        },
    ];

    return (
        <>
            <DataTable
                columns={columns}
                data={filteredOrders}
                rowKey={(orderToReceive) => orderToReceive.id as string}
                emptyTitle="Nenhum registro encontrado"
                emptyDescription="Não há valores a receber para exibir."
                searchPlaceholder="Buscar por cliente ou pedido"
                searchValue={query}
                onSearchChange={onQueryChange}
                toolbarExtra={toolbarExtra}
                footer={footer}
            />

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
        </>
    );
}
