import { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faEnvelopeCircleCheck, faTrash, faBoxOpen } from "@fortawesome/free-solid-svg-icons";
import { IOrderDelivery } from "../../interfaces/IOrderDelivery";
import { convertMoney, formatTelephone } from "../../utils";
import { ConfirmPopUp } from "../ConfirmPopUp";
import { NewOrderDeliveryModal } from "../NewOrderDeliveryModal";
import { useOrderDeliveries } from "../../contexts/OrderDeliveriesContext";
import { useSuccessMessage } from "../../contexts/SuccessMessageContext";
import { DataTable, ColumnDef } from "../DataTable";
import { RowActions, IconButton } from "../DataTable/style";
import { Badge } from "../Badge";

interface OrderDeliveriesTableProps {
    deliveries: IOrderDelivery[];
    filter: 'active' | 'archived' | 'all';
    page: number;
    pageSize: number;
    query: string;
    selectedIds: string[];
    onSelectDelivery: (id: string) => void;
    onSelectAll: (checked: boolean) => void;
    onQueryChange?: (query: string) => void;
    toolbarExtra?: React.ReactNode;
    footer?: React.ReactNode;
}

export function OrderDeliveriesTable({ deliveries, filter, page, pageSize, query, selectedIds, onSelectDelivery, onSelectAll, onQueryChange, toolbarExtra, footer }: OrderDeliveriesTableProps) {
    const { updateOrderDelivery, deleteOrderDelivery, loadOrderDeliveries } = useOrderDeliveries();
    const { showSuccess } = useSuccessMessage();
    const [confirmPayModal, setConfirmPayModal] = useState(false);
    const [confirmArchiveModal, setConfirmArchiveModal] = useState(false);
    const [confirmUnarchiveModal, setConfirmUnarchiveModal] = useState(false);
    const [confirmDeleteModal, setConfirmDeleteModal] = useState(false);
    const [editModal, setEditModal] = useState(false);
    const [selectedDeliveryId, setSelectedDeliveryId] = useState<string>("");
    const [selectedOrderDelivery, setSelectedOrderDelivery] = useState<IOrderDelivery | null>(null);
    const navigate = useNavigate();

    const handlePay = async () => {
        try {
            await updateOrderDelivery(selectedDeliveryId, {
                is_paid: true
            });

            await loadOrderDeliveries(page, pageSize, query, filter);
            setConfirmPayModal(false);
            setSelectedDeliveryId("");
            showSuccess("Novo pedido online recebido! 🛍️");
        } catch (error) {
            console.error("Error confirming payment:", error);
            alert("Erro ao confirmar pagamento. Tente novamente.");
        }
    };

    const handleArchive = async () => {
        try {
            await updateOrderDelivery(selectedDeliveryId, {
                is_archived: true
            });

            await loadOrderDeliveries(page, pageSize, query, filter);
            setConfirmArchiveModal(false);
            setSelectedDeliveryId("");
            showSuccess("Entrega arquivada com sucesso!");
        } catch (error) {
            console.error("Error archiving delivery:", error);
            alert("Erro ao arquivar entrega. Tente novamente.");
        }
    };

    const handleUnarchive = async () => {
        try {
            await updateOrderDelivery(selectedDeliveryId, {
                is_archived: false
            });

            await loadOrderDeliveries(page, pageSize, query, filter);
            setConfirmUnarchiveModal(false);
            setSelectedDeliveryId("");
            showSuccess("Entrega desarquivada com sucesso!");
        } catch (error) {
            console.error("Error unarchiving delivery:", error);
            alert("Erro ao desarquivar entrega. Tente novamente.");
        }
    };

    const handleDelete = async () => {
        try {
            await deleteOrderDelivery(selectedDeliveryId);
            await loadOrderDeliveries(page, pageSize, query, filter);
            setConfirmDeleteModal(false);
            setSelectedDeliveryId("");
            showSuccess("Entrega deletada com sucesso!");
        } catch (error) {
            console.error("Error deleting delivery:", error);
            alert("Erro ao deletar entrega. Tente novamente.");
        }
    };

    const filteredDeliveries = deliveries || [];

    const columns: ColumnDef<IOrderDelivery>[] = [
        {
            key: 'select',
            header: '',
            width: '5%',
            headerRender: () => (
                <input
                    type="checkbox"
                    checked={filteredDeliveries.length > 0 && selectedIds.length === filteredDeliveries.length}
                    onChange={(e) => onSelectAll(e.target.checked)}
                    style={{ cursor: 'pointer', width: '18px', height: '18px' }}
                />
            ),
            render: (delivery) => (
                <input
                    type="checkbox"
                    checked={selectedIds.includes(delivery.id!)}
                    onChange={() => onSelectDelivery(delivery.id!)}
                    style={{ cursor: 'pointer', width: '18px', height: '18px' }}
                />
            ),
        },
        {
            key: 'delivery_man',
            header: 'Motoboy',
            width: '15%',
            render: (delivery) => (
                <span
                    style={{ cursor: 'pointer', color: 'var(--dt-accent)', fontWeight: 700 }}
                    onClick={() => navigate(`/backoffice/motoboy/${delivery.deliveryMan?.id}`)}
                >
                    {delivery.deliveryMan?.name || 'N/A'}
                </span>
            ),
        },
        {
            key: 'order_code',
            header: 'Nº Pedido',
            width: '7%',
            render: (delivery) => (
                <Link to={`/backoffice/pedido/${delivery.order_id}`} style={{ color: 'var(--dt-accent)', fontWeight: 700, textDecoration: 'none' }}>
                    #{delivery.order?.code || 'N/A'}
                </Link>
            ),
        },
        {
            key: 'client',
            header: 'Cliente',
            width: '15%',
            render: (delivery) => delivery.order?.client ? `${delivery.order.client.first_name} ${delivery.order.client.last_name}` : 'N/A',
        },
        {
            key: 'phone',
            header: 'Telefone',
            width: '11%',
            render: (delivery) => formatTelephone(delivery.order?.client.phone_number as string) || 'N/A',
        },
        {
            key: 'delivery_fee',
            header: 'Taxa de Entrega',
            width: '9%',
            render: (delivery) => convertMoney(delivery.order?.delivery_fee || 0),
        },
        {
            key: 'delivery_date',
            header: 'Data de Entrega',
            sortable: true,
            width: '13%',
            sortValue: (delivery) => new Date(delivery.delivery_date).getTime(),
            render: (delivery) => moment(delivery.delivery_date).format('DD/MM/YYYY HH:mm'),
        },
        {
            key: 'payment',
            header: 'Pagamento',
            render: (delivery) => (
                <Badge tone={delivery.is_paid ? 'good' : 'warn'}>
                    {delivery.is_paid ? 'Pago' : 'Pendente'}
                </Badge>
            ),
        },
        {
            key: 'actions',
            header: 'Ações',
            render: (delivery) => (
                <RowActions>
                    {!delivery.is_archived ? (
                        <IconButton
                            $tone="default"
                            title="Arquivar"
                            onClick={() => {
                                setSelectedDeliveryId(delivery.id!);
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
                                setSelectedDeliveryId(delivery.id!);
                                setConfirmUnarchiveModal(true);
                            }}
                        >
                            <FontAwesomeIcon icon={faBoxOpen}/>
                        </IconButton>
                    )}

                    {!delivery.is_paid && (
                        <IconButton
                            $tone="view"
                            title="Confirmar Pagamento"
                            onClick={() => {
                                setSelectedDeliveryId(delivery.id!);
                                setConfirmPayModal(true);
                            }}
                        >
                            <FontAwesomeIcon icon={faCheck}/>
                        </IconButton>
                    )}

                    <IconButton
                        $tone="delete"
                        title="Deletar"
                        onClick={() => {
                            setSelectedDeliveryId(delivery.id!);
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
                data={filteredDeliveries}
                rowKey={(delivery) => delivery.id as string}
                emptyTitle="Nenhum registro encontrado"
                emptyDescription="Não há entregas para exibir."
                searchPlaceholder="Buscar por Motoboy, Pedido ou Cliente..."
                searchValue={query}
                onSearchChange={onQueryChange}
                toolbarExtra={toolbarExtra}
                footer={footer}
            />

            <ConfirmPopUp
                isOpen={confirmPayModal}
                onRequestClose={() => {
                    setConfirmPayModal(false);
                    setSelectedDeliveryId("");
                }}
                handleAction={handlePay}
                actionLabel="Confirmar Pagamento ao Motoboy"
                label="Confirmar"
            />

            <ConfirmPopUp
                isOpen={confirmArchiveModal}
                onRequestClose={() => {
                    setConfirmArchiveModal(false);
                    setSelectedDeliveryId("");
                }}
                handleAction={handleArchive}
                actionLabel="Deseja arquivar esta entrega?"
                label="Arquivar"
            />

            <ConfirmPopUp
                isOpen={confirmUnarchiveModal}
                onRequestClose={() => {
                    setConfirmUnarchiveModal(false);
                    setSelectedDeliveryId("");
                }}
                handleAction={handleUnarchive}
                actionLabel="Deseja desarquivar esta entrega?"
                label="Desarquivar"
            />

            <ConfirmPopUp
                isOpen={confirmDeleteModal}
                onRequestClose={() => {
                    setConfirmDeleteModal(false);
                    setSelectedDeliveryId("");
                }}
                handleAction={handleDelete}
                actionLabel="Tem certeza que deseja deletar esta entrega?"
                label="Deletar"
            />

            <NewOrderDeliveryModal
                isOpen={editModal}
                onRequestClose={() => {
                    setEditModal(false);
                    setSelectedOrderDelivery(null);
                }}
                action="edit"
                currentOrderDelivery={selectedOrderDelivery}
            />
        </>
    );
}
