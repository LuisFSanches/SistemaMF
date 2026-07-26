import { useState, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { useOrdersToReceive } from "../../contexts/OrdersToReceiveContext";
import { NewOrderToReceiveModal } from "../../components/NewOrderToReceiveModal";
import { OrdersToReceiveTable } from "../../components/OrdersToReceiveTable";
import { Pagination } from "../../components/Pagination";
import { convertMoney } from "../../utils";
import {
    Container,
    TotalCard,
    AddButton,
    FilterToggleContainer,
    FilterButton
} from "./style";
import { PageHeader } from "../../styles/global";

export function OrdersToReceivePage() {
    const { ordersToReceive, totalOrders, loadOrdersToReceive, totalToReceive } = useOrdersToReceive();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [filter, setFilter] = useState<'active' | 'archived' | 'all'>('active');
    const [page, setPage] = useState(1);
    const [query, setQuery] = useState('');
    const pageSize = 10;

    useEffect(() => {
        loadOrdersToReceive(page, pageSize, query, filter);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page, query, filter]);

    const handleQueryChange = (text: string) => {
        setQuery(text);
        setPage(1);
    }

    return (
        <Container>
            <PageHeader>
                <div>
                    <h1>Valores a Receber</h1>
                    <TotalCard>
                        <h3>Total a receber: </h3>
                        <p>{convertMoney(totalToReceive)}</p>
                    </TotalCard>
                </div>

                <AddButton onClick={() => setIsModalOpen(true)}>
                    <FontAwesomeIcon icon={faPlus} />
                    <span>Contas a receber</span>
                </AddButton>
            </PageHeader>

            <OrdersToReceiveTable
                orders={ordersToReceive}
                filter={filter}
                page={page}
                pageSize={pageSize}
                query={query}
                onQueryChange={handleQueryChange}
                toolbarExtra={
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
                }
                footer={
                    <>
                        <span className="dt-count">
                            Mostrando <strong>{ordersToReceive.length}</strong> de <strong>{totalOrders}</strong>
                        </span>
                        <Pagination
                            currentPage={page}
                            total={totalOrders}
                            pageSize={pageSize as number}
                            onPageChange={setPage}
                        />
                    </>
                }
            />

            <NewOrderToReceiveModal
                isOpen={isModalOpen}
                onRequestClose={() => setIsModalOpen(false)}
                action="create"
                currentOrderToReceive={null}
            />
        </Container>
    );
}
