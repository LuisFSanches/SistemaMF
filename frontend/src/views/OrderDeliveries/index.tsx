import { useState, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faCheck, faEnvelopeCircleCheck, faBoxOpen } from "@fortawesome/free-solid-svg-icons";
import { useOrderDeliveries } from "../../contexts/OrderDeliveriesContext";
import { useSuccessMessage } from "../../contexts/SuccessMessageContext";
import { NewOrderDeliveryModal } from "../../components/NewOrderDeliveryModal";
import { OrderDeliveriesTable } from "../../components/OrderDeliveriesTable";
import { Pagination } from "../../components/Pagination";
import { DateRangePicker } from "../../components/DateRangePicker";
import { ConfirmPopUp } from "../../components/ConfirmPopUp";
import {
    Container,
    ButtonsContainer,
    AddButton,
    FilterToggleContainer,
    FilterButton,
    MassActionsContainer
} from "./style";
import { PageHeader } from "../../styles/global";

export function OrderDeliveriesPage() {
    const { orderDeliveries, totalDeliveries, loadOrderDeliveries, bulkUpdateOrderDeliveries } = useOrderDeliveries();
    const { showSuccess } = useSuccessMessage();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [filter, setFilter] = useState<'active' | 'archived' | 'all'>('active');
    const [page, setPage] = useState(1);
    const [query, setQuery] = useState('');
    const [startDate, setStartDate] = useState<string | null>(null);
    const [endDate, setEndDate] = useState<string | null>(null);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [confirmBulkPayModal, setConfirmBulkPayModal] = useState(false);
    const [confirmBulkArchiveModal, setConfirmBulkArchiveModal] = useState(false);
    const [confirmBulkUnarchiveModal, setConfirmBulkUnarchiveModal] = useState(false);
    const pageSize = 45;

    useEffect(() => {
        loadOrderDeliveries(page, pageSize, query, filter, startDate, endDate);
        setSelectedIds([]);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page, query, filter, startDate, endDate]);



    const handleDateRangeChange = (start: string | null, end: string | null, filterType: string) => {
        setStartDate(start);
        setEndDate(end);
    };

    const searchDeliveries = (text: string) => {
        setQuery(text);
        setPage(1);
    }

    const handleSelectDelivery = (id: string) => {
        setSelectedIds(prev => 
            prev.includes(id) ? prev.filter(selectedId => selectedId !== id) : [...prev, id]
        );
    };

    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            setSelectedIds(orderDeliveries.map(d => d.id!));
        } else {
            setSelectedIds([]);
        }
    };

    const handleBulkPay = async () => {
        try {
            await bulkUpdateOrderDeliveries(selectedIds, { is_paid: true });
            await loadOrderDeliveries(page, pageSize, query, filter, startDate, endDate);
            setSelectedIds([]);
            setConfirmBulkPayModal(false);
            showSuccess(`${selectedIds.length} entrega(s) marcada(s) como paga(s)!`);
        } catch (error) {
            console.error("Error in bulk payment:", error);
            alert("Erro ao confirmar pagamentos. Tente novamente.");
        }
    };

    const handleBulkArchive = async () => {
        try {
            await bulkUpdateOrderDeliveries(selectedIds, { is_archived: true });
            await loadOrderDeliveries(page, pageSize, query, filter, startDate, endDate);
            setSelectedIds([]);
            setConfirmBulkArchiveModal(false);
            showSuccess(`${selectedIds.length} entrega(s) arquivada(s)!`);
        } catch (error) {
            console.error("Error in bulk archive:", error);
            alert("Erro ao arquivar entregas. Tente novamente.");
        }
    };

    const handleBulkUnarchive = async () => {
        try {
            await bulkUpdateOrderDeliveries(selectedIds, { is_archived: false });
            await loadOrderDeliveries(page, pageSize, query, filter, startDate, endDate);
            setSelectedIds([]);
            setConfirmBulkUnarchiveModal(false);
            showSuccess(`${selectedIds.length} entrega(s) desarquivada(s)!`);
        } catch (error) {
            console.error("Error in bulk unarchive:", error);
            alert("Erro ao desarquivar entregas. Tente novamente.");
        }
    };

    return (
        <Container>
            <PageHeader>
                <div>
                    <h1>Entregas de Pedidos</h1>
                    <input
                        style={{width: '330px'}}
                        type="text"
                        placeholder="Buscar por Motoboy, Pedido ou Cliente..."
                        onKeyDown={(e: any) => {
                            if (e.key === 'Enter') {
                                searchDeliveries(e.target.value);
                            }
                        }}
                    />
                </div>

                <ButtonsContainer>
                    <FilterToggleContainer>
                        <FilterButton
                            active={filter === 'active'}
                            onClick={() => {
                                setFilter('active');
                                setPage(1);
                            }}
                        >
                            Ativos
                        </FilterButton>
                        <FilterButton
                            active={filter === 'archived'}
                            onClick={() => {
                                setFilter('archived');
                                setPage(1);
                            }}
                        >
                            Arquivados
                        </FilterButton>
                        <FilterButton
                            active={filter === 'all'}
                            onClick={() => {
                                setFilter('all');
                                setPage(1);
                            }}
                        >
                            Todos
                        </FilterButton>
                    </FilterToggleContainer>

                    <DateRangePicker onDateRangeChange={handleDateRangeChange} />
                </ButtonsContainer>
                <div>
                    <Pagination
                        currentPage={page}
                        total={totalDeliveries}
                        pageSize={pageSize as number}
                        onPageChange={setPage}
                    />
                    <AddButton onClick={() => setIsModalOpen(true)}>
                        <FontAwesomeIcon icon={faPlus} />
                        <span>Nova Entrega</span>
                    </AddButton>
                </div>
            </PageHeader>
            <MassActionsContainer>
                {selectedIds.length > 0 && (
                    <>
                        {filter === 'archived' ? (
                            <button
                                className="archive-button"
                                onClick={() => setConfirmBulkUnarchiveModal(true)}
                            >
                                <FontAwesomeIcon icon={faBoxOpen} />
                                <span>Desarquivar Selecionados ({selectedIds.length})</span>
                            </button>
                        ) : (
                            <button
                                className="archive-button"
                                onClick={() => setConfirmBulkArchiveModal(true)}
                            >
                                <FontAwesomeIcon icon={faEnvelopeCircleCheck} />
                                <span>Arquivar Selecionados ({selectedIds.length})</span>
                            </button>
                        )}
                        <button
                            className="pay-button"
                            onClick={() => setConfirmBulkPayModal(true)}
                        >
                            <FontAwesomeIcon icon={faCheck} />
                            <span>Confirmar Pagamento ({selectedIds.length})</span>
                        </button>
                    </>
                )}
            </MassActionsContainer>
            <OrderDeliveriesTable 
                deliveries={orderDeliveries} 
                filter={filter} 
                page={page}
                pageSize={pageSize}
                query={query}
                selectedIds={selectedIds}
                onSelectDelivery={handleSelectDelivery}
                onSelectAll={handleSelectAll}
            />

            <NewOrderDeliveryModal
                isOpen={isModalOpen}
                onRequestClose={() => setIsModalOpen(false)}
                action="create"
                currentOrderDelivery={null}
            />

            <ConfirmPopUp
                isOpen={confirmBulkPayModal}
                onRequestClose={() => setConfirmBulkPayModal(false)}
                handleAction={handleBulkPay}
                actionLabel={`Confirmar pagamento de ${selectedIds.length} entrega(s)?`}
                label="Confirmar"
            />

            <ConfirmPopUp
                isOpen={confirmBulkArchiveModal}
                onRequestClose={() => setConfirmBulkArchiveModal(false)}
                handleAction={handleBulkArchive}
                actionLabel={`Arquivar ${selectedIds.length} entrega(s)?`}
                label="Arquivar"
            />

            <ConfirmPopUp
                isOpen={confirmBulkUnarchiveModal}
                onRequestClose={() => setConfirmBulkUnarchiveModal(false)}
                handleAction={handleBulkUnarchive}
                actionLabel={`Desarquivar ${selectedIds.length} entrega(s)?`}
                label="Desarquivar"
            />
        </Container>
    );
}
