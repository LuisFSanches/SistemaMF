import { useState, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { useOrdersToReceive } from "../../contexts/OrdersToReceiveContext";
import { NewOrderToReceiveModal } from "../../components/NewOrderToReceiveModal";
import { OrdersToReceiveTable } from "../../components/OrdersToReceiveTable";
import { convertMoney } from "../../utils";
import {
    Container,
    TotalCard,
    ButtonsContainer,
    AddButton,
    FilterToggleContainer,
    FilterButton
} from "./style";
import { PageHeader } from "../../styles/global";

export function OrdersToReceivePage() {
    const { ordersToReceive, loadOrdersToReceive } = useOrdersToReceive();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [filter, setFilter] = useState<'active' | 'archived' | 'all'>('active');

    useEffect(() => {
        loadOrdersToReceive();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const calculateTotal = () => {
        return ordersToReceive
        .filter(order => !order.is_archived && !order.received_date)
        .reduce((sum, order) => sum + (order.order?.total || 0), 0);
    };

    return (
        <Container>
            <PageHeader>
                <div>
                    <h1>Valores a Receber</h1>
                    <TotalCard>
                        <h3>Total a receber: </h3>
                        <p>{convertMoney(calculateTotal())}</p>
                    </TotalCard>
                </div>

                <ButtonsContainer>
                    <FilterToggleContainer>
                        <FilterButton
                            active={filter === 'active'}
                            onClick={() => setFilter('active')}
                        >
                            Ativos
                        </FilterButton>
                        <FilterButton
                            active={filter === 'archived'}
                            onClick={() => setFilter('archived')}
                        >
                            Arquivados
                        </FilterButton>
                        <FilterButton
                            active={filter === 'all'}
                            onClick={() => setFilter('all')}
                        >
                            Todos
                        </FilterButton>
                    </FilterToggleContainer>

                    <AddButton onClick={() => setIsModalOpen(true)}>
                        <FontAwesomeIcon icon={faPlus} />
                        <span>Contas a receber</span>
                    </AddButton>
                </ButtonsContainer>
            </PageHeader>

            <OrdersToReceiveTable orders={ordersToReceive} filter={filter} />

            <NewOrderToReceiveModal
                isOpen={isModalOpen}
                onRequestClose={() => setIsModalOpen(false)}
                action="create"
                currentOrderToReceive={null}
            />
        </Container>
    );
}
