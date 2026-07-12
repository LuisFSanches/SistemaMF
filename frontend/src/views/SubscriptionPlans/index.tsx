import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faPen, faTrash, faCheck, faTimes, faCreditCard, faCheckCircle, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { PageHeader, AddButton } from '../../styles/global';
import {
    Container,
    ContentWrapper,
    StatsCards,
    StatCard,
    TableWrapper,
    TableHeader,
    PlansTable,
    PlanName,
    PlanDescription,
    PlanPrice,
    PlanCycle,
    StatusBadge,
    ActionButtons,
    EmptyState,
    LoadingContainer
} from './style';
import { PlanModal } from '../../components/PlanModal';
import { getAllPlans, deletePlan, updatePlan } from '../../services/subscriptionService';
import { ISubscriptionPlan } from '../../interfaces/ISubscription';
import { ConfirmPopUp } from '../../components/ConfirmPopUp';

export function SubscriptionPlans() {
    const [plans, setPlans] = useState<ISubscriptionPlan[]>([]);
    const [loading, setLoading] = useState(true);
    const [showPlanModal, setShowPlanModal] = useState(false);
    const [modalAction, setModalAction] = useState<'create' | 'edit'>('create');
    const [currentPlan, setCurrentPlan] = useState<ISubscriptionPlan | null>(null);
    const [showConfirmDelete, setShowConfirmDelete] = useState(false);
    const [planToDelete, setPlanToDelete] = useState<string | null>(null);

    useEffect(() => {
        loadPlans();
    }, []);

    const loadPlans = async () => {
        setLoading(true);
        try {
            const { data } = await getAllPlans();
            setPlans(data);
        } catch (error) {
            console.error('Erro ao carregar planos:', error);
            alert('Erro ao carregar planos. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    const handleCreatePlan = () => {
        setCurrentPlan(null);
        setModalAction('create');
        setShowPlanModal(true);
    };

    const handleEditPlan = (plan: ISubscriptionPlan) => {
        setCurrentPlan(plan);
        setModalAction('edit');
        setShowPlanModal(true);
    };

    const handleToggleStatus = async (plan: ISubscriptionPlan) => {
        try {
            await updatePlan(plan.id, { is_active: !plan.is_active });
            alert(`Plano ${plan.is_active ? 'desativado' : 'ativado'} com sucesso!`);
            loadPlans();
        } catch (error) {
            console.error('Erro ao alterar status do plano:', error);
            alert('Erro ao alterar status. Tente novamente.');
        }
    };

    const handleDeletePlan = (planId: string) => {
        setPlanToDelete(planId);
        setShowConfirmDelete(true);
    };

    const confirmDelete = async () => {
        if (!planToDelete) return;

        try {
            await deletePlan(planToDelete);
            alert('Plano excluído com sucesso!');
            loadPlans();
        } catch (error) {
            console.error('Erro ao excluir plano:', error);
            alert('Erro ao excluir plano. Tente novamente.');
        } finally {
            setShowConfirmDelete(false);
            setPlanToDelete(null);
        }
    };

    const formatPrice = (price: number) => {
        return price.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        });
    };

    const getCycleLabel = (cycle: string) => {
        return cycle === 'MONTHLY' ? 'Mensal' : 'Anual';
    };

    const activePlans = plans.filter(p => p.is_active).length;
    const inactivePlans = plans.filter(p => !p.is_active).length;

    if (loading) {
        return (
            <Container>
                <LoadingContainer>
                    Carregando planos...
                </LoadingContainer>
            </Container>
        );
    }

    return (
        <Container>
            <ContentWrapper>
                <PageHeader>
                    <h1>
                        <FontAwesomeIcon icon={faCreditCard} /> Planos de Assinatura
                    </h1>
                    <AddButton onClick={handleCreatePlan}>
                        <FontAwesomeIcon icon={faPlus} />
                        <p>Novo Plano</p>
                    </AddButton>
                </PageHeader>

                <StatsCards>
                    <StatCard>
                        <div className="icon total">
                            <FontAwesomeIcon icon={faCreditCard} />
                        </div>
                        <div className="info">
                            <h4>Total de Planos</h4>
                            <p>{plans.length}</p>
                        </div>
                    </StatCard>

                    <StatCard>
                        <div className="icon active">
                            <FontAwesomeIcon icon={faCheckCircle} />
                        </div>
                        <div className="info">
                            <h4>Planos Ativos</h4>
                            <p>{activePlans}</p>
                        </div>
                    </StatCard>

                    <StatCard>
                        <div className="icon inactive">
                            <FontAwesomeIcon icon={faTimesCircle} />
                        </div>
                        <div className="info">
                            <h4>Planos Inativos</h4>
                            <p>{inactivePlans}</p>
                        </div>
                    </StatCard>
                </StatsCards>

                <TableWrapper>
                    <TableHeader>
                        <h2>Lista de Planos</h2>
                    </TableHeader>

                    {plans.length === 0 ? (
                        <EmptyState>
                            <FontAwesomeIcon icon={faCreditCard} />
                            <h3>Nenhum plano cadastrado</h3>
                            <p>Clique em "Novo Plano" para criar o primeiro plano de assinatura.</p>
                        </EmptyState>
                    ) : (
                        <PlansTable>
                            <thead>
                                <tr>
                                    <th>Plano</th>
                                    <th>Preço</th>
                                    <th>Ciclo</th>
                                    <th>Status</th>
                                    <th>Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {plans.map((plan) => (
                                    <tr key={plan.id}>
                                        <td data-label="Plano">
                                            <PlanName>{plan.name}</PlanName>
                                            <PlanDescription>{plan.description}</PlanDescription>
                                        </td>
                                        <td data-label="Preço">
                                            <PlanPrice>{formatPrice(plan.price)}</PlanPrice>
                                        </td>
                                        <td data-label="Ciclo">
                                            <PlanCycle cycle={plan.billing_cycle}>
                                                {getCycleLabel(plan.billing_cycle)}
                                            </PlanCycle>
                                        </td>
                                        <td data-label="Status">
                                            <StatusBadge active={plan.is_active}>
                                                <FontAwesomeIcon icon={plan.is_active ? faCheckCircle : faTimesCircle} />
                                                {plan.is_active ? 'Ativo' : 'Inativo'}
                                            </StatusBadge>
                                        </td>
                                        <td data-label="Ações">
                                            <ActionButtons>
                                                <button
                                                    className="edit"
                                                    onClick={() => handleEditPlan(plan)}
                                                    title="Editar plano"
                                                >
                                                    <FontAwesomeIcon icon={faPen} />
                                                    Editar
                                                </button>
                                                <button
                                                    className="toggle"
                                                    onClick={() => handleToggleStatus(plan)}
                                                    title={plan.is_active ? 'Desativar' : 'Ativar'}
                                                >
                                                    <FontAwesomeIcon icon={plan.is_active ? faTimes : faCheck} />
                                                    {plan.is_active ? 'Desativar' : 'Ativar'}
                                                </button>
                                                <button
                                                    className="delete"
                                                    onClick={() => handleDeletePlan(plan.id)}
                                                    title="Excluir plano"
                                                >
                                                    <FontAwesomeIcon icon={faTrash} />
                                                    Excluir
                                                </button>
                                            </ActionButtons>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </PlansTable>
                    )}
                </TableWrapper>
            </ContentWrapper>

            <PlanModal
                isOpen={showPlanModal}
                onRequestClose={() => setShowPlanModal(false)}
                action={modalAction}
                plan={currentPlan}
                onSuccess={loadPlans}
            />

            <ConfirmPopUp
                isOpen={showConfirmDelete}
                onRequestClose={() => setShowConfirmDelete(false)}
                handleAction={confirmDelete}
                actionLabel="Tem certeza que deseja excluir este plano?"
                label="Confirmar Exclusão"
            />
        </Container>
    );
}
