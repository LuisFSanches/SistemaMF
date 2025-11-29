import { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faEnvelopeCircleCheck, faTrash, faBoxOpen } from "@fortawesome/free-solid-svg-icons";
import { IOrderDelivery } from "../../interfaces/IOrderDelivery";
import { convertMoney } from "../../utils";
import { ConfirmPopUp } from "../ConfirmPopUp";
import { NewOrderDeliveryModal } from "../NewOrderDeliveryModal";
import { useOrderDeliveries } from "../../contexts/OrderDeliveriesContext";
import { useSuccessMessage } from "../../contexts/SuccessMessageContext";
import {
    Container,
    StatusBadge,
    ActionsContainer,
    EmptyState
} from "./style";

interface OrderDeliveriesTableProps {
    deliveries: IOrderDelivery[];
    filter: 'active' | 'archived' | 'all';
    page: number;
    pageSize: number;
    query: string;
}

export function OrderDeliveriesTable({ deliveries, filter, page, pageSize, query }: OrderDeliveriesTableProps) {
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
            showSuccess("Pagamento confirmado com sucesso!");
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

    if (filteredDeliveries.length === 0) {
        return (
            <Container>
                <EmptyState>
                    <h3>Nenhum registro encontrado</h3>
                    <p>Não há entregas para exibir.</p>
                </EmptyState>
            </Container>
        );
    }

    return (
        <Container>
            <table>
                <thead>
                    <tr>
                        <th>Motoboy</th>
                        <th>Nº Pedido</th>
                        <th>Taxa de Entrega</th>
                        <th>Data de Entrega</th>
                        <th>Pagamento</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredDeliveries.map((delivery) => (
                        <tr key={delivery.id}>
                            <td
                                style={{ cursor: 'pointer', color: '#EC4899', fontWeight: '600' }}
                                onClick={() => navigate(`/backoffice/motoboy/${delivery.deliveryMan?.id}`)}
                            >
                                {delivery.deliveryMan?.name || 'N/A'}
                            </td>
                            <td>
                                <Link to={`/backoffice/pedido/${delivery.order_id}`} className="order-code-link">
                                    #{delivery.order?.code || 'N/A'}
                                </Link>
                            </td>
                            <td>{convertMoney(delivery.order?.delivery_fee || 0)}</td>
                            <td>{moment(delivery.delivery_date).format('DD/MM/YYYY HH:mm')}</td>
                            <td>
                                <StatusBadge status={delivery.is_paid ? 'Pago' : 'Pendente'}>
                                    {delivery.is_paid ? 'Pago' : 'Pendente'}
                                </StatusBadge>
                            </td>
                            <td>
                                <ActionsContainer>
                                    {!delivery.is_archived ? (
                                        <button className="view-button"
                                            onClick={() => {
                                                setSelectedDeliveryId(delivery.id!);
                                                setConfirmArchiveModal(true);
                                            }}
                                            title="Arquivar"
                                        >
                                            <FontAwesomeIcon icon={faEnvelopeCircleCheck}/>
                                        </button>
                                    ) : (
                                        <button className="view-button"
                                            onClick={() => {
                                                setSelectedDeliveryId(delivery.id!);
                                                setConfirmUnarchiveModal(true);
                                            }}
                                            title="Desarquivar"
                                        >
                                            <FontAwesomeIcon icon={faBoxOpen}/>
                                        </button>
                                    )}

                                    {!delivery.is_paid && (
                                        <button className="done-button"
                                            onClick={() => {
                                                setSelectedDeliveryId(delivery.id!);
                                                setConfirmPayModal(true);
                                            }}
                                            title="Confirmar Pagamento"
                                        >
                                            <FontAwesomeIcon icon={faCheck}/>
                                        </button>
                                    )}

                                    <button className="del-button"
                                        onClick={() => {
                                            setSelectedDeliveryId(delivery.id!);
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
        </Container>
    );
}
