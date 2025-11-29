import { useState, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { useOrderDeliveries } from "../../contexts/OrderDeliveriesContext";
import { NewOrderDeliveryModal } from "../../components/NewOrderDeliveryModal";
import { OrderDeliveriesTable } from "../../components/OrderDeliveriesTable";
import { Pagination } from "../../components/Pagination";
import {
    Container,
    ButtonsContainer,
    AddButton,
    FilterToggleContainer,
    FilterButton
} from "./style";
import { PageHeader } from "../../styles/global";

export function OrderDeliveriesPage() {
    const { orderDeliveries, totalDeliveries, loadOrderDeliveries } = useOrderDeliveries();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [filter, setFilter] = useState<'active' | 'archived' | 'all'>('active');
    const [page, setPage] = useState(1);
    const [query, setQuery] = useState('');
    const pageSize = 30;

    useEffect(() => {
        loadOrderDeliveries(page, pageSize, query, filter);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page, query, filter]);

    const searchDeliveries = (text: string) => {
        setQuery(text);
        setPage(1);
    }

    return (
        <Container>
            <PageHeader>
                <div>
                    <h1>Entregas de Pedidos</h1>
                </div>

                <input
                    style={{width: '250px'}}
                    type="text"
                    placeholder="Buscar por Motoboy ou Pedido"
                    onKeyDown={(e: any) => {
                        if (e.key === 'Enter') {
                            searchDeliveries(e.target.value);
                        }
                    }}
                />

                <Pagination
                    currentPage={page}
                    total={totalDeliveries}
                    pageSize={pageSize as number}
                    onPageChange={setPage}
                />

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

                    <AddButton onClick={() => setIsModalOpen(true)}>
                        <FontAwesomeIcon icon={faPlus} />
                        <span>Nova Entrega</span>
                    </AddButton>
                </ButtonsContainer>
            </PageHeader>

            <OrderDeliveriesTable 
                deliveries={orderDeliveries} 
                filter={filter} 
                page={page}
                pageSize={pageSize}
                query={query}
            />

            <NewOrderDeliveryModal
                isOpen={isModalOpen}
                onRequestClose={() => setIsModalOpen(false)}
                action="create"
                currentOrderDelivery={null}
            />
        </Container>
    );
}
