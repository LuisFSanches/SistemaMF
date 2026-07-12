import { useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faCreditCard, 
    faCalendar, 
    faExclamationCircle,
    faCheckCircle,
    faClock
} from '@fortawesome/free-solid-svg-icons';
import { 
    BillingContainer,
    BillingCard,
    CardHeader,
    CardContent,
    PlanInfo,
    InfoRow,
    InfoLabel,
    InfoValue,
    StatusBadge,
    EmptyState,
    LoadingContainer,
    ActionButton,
    NextBillHighlight,
    BillBreakdown,
    BreakdownItem
} from './style';
import { useSubscription } from '../../contexts/SubscriptionContext';
import moment from 'moment';
import 'moment/locale/pt-br';

moment.locale('pt-br');

export function BillingTab() {
    const { 
        billingInfo, 
        loadBillingInfo, 
        loading,
        setShowPlanSelectorModal
    } = useSubscription();

    useEffect(() => {
        loadBillingInfo();
    }, [loadBillingInfo]);

    const formatDate = (date: string) => {
        return moment(date).format('DD/MM/YYYY');
    };

    const formatCurrency = (value: number) => {
        return value.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        });
    };

    const handleChangePlan = () => {
        setShowPlanSelectorModal(true);
    };

    if (loading && !billingInfo) {
        return (
            <LoadingContainer>
                <p style={{ textAlign: 'center', color: 'var(--text-light)' }}>Carregando informações de faturamento...</p>
            </LoadingContainer>
        );
    }

    if (!billingInfo) {
        return (
            <EmptyState>
                <FontAwesomeIcon icon={faExclamationCircle} />
                <p>Não foi possível carregar as informações de faturamento.</p>
            </EmptyState>
        );
    }

    return (
        <BillingContainer>
            {/* Status da Assinatura */}
            <BillingCard>
                <CardHeader>
                    <FontAwesomeIcon icon={faCreditCard} />
                    <h3>Plano Atual</h3>
                </CardHeader>
                <CardContent>
                    {billingInfo.subscription_status.is_trial ? (
                        <StatusBadge color="#F59E0B">
                            <FontAwesomeIcon icon={faClock} />
                            Período Trial
                        </StatusBadge>
                    ) : billingInfo.subscription_status.is_active ? (
                        <StatusBadge color="#10B981">
                            <FontAwesomeIcon icon={faCheckCircle} />
                            Assinatura Ativa
                        </StatusBadge>
                    ) : (
                        <StatusBadge color="#EF4444">
                            <FontAwesomeIcon icon={faExclamationCircle} />
                            Assinatura Inativa
                        </StatusBadge>
                    )}

                    <PlanInfo>
                        <InfoRow>
                            <InfoLabel>Plano:</InfoLabel>
                            <InfoValue>
                                {billingInfo.subscription_status.current_plan?.name || 'Nenhum plano ativo'}
                            </InfoValue>
                        </InfoRow>
                        
                        {billingInfo.subscription_status.current_plan && (
                            <>
                                <InfoRow>
                                    <InfoLabel>Valor:</InfoLabel>
                                    <InfoValue>
                                        {formatCurrency(billingInfo.subscription_status.current_plan.price)} / mês
                                    </InfoValue>
                                </InfoRow>

                                <InfoRow>
                                    <InfoLabel>Ciclo de Cobrança:</InfoLabel>
                                    <InfoValue>
                                        {billingInfo.subscription_status.current_plan.billing_cycle === 'MONTHLY' 
                                            ? 'Mensal' 
                                            : 'Anual'}
                                    </InfoValue>
                                </InfoRow>

                                <InfoRow>
                                    <InfoLabel>Próxima Cobrança:</InfoLabel>
                                    <InfoValue>
                                        {billingInfo.subscription_status.next_billing_date 
                                            ? formatDate(billingInfo.subscription_status.next_billing_date)
                                            : '-'}
                                    </InfoValue>
                                </InfoRow>
                            </>
                        )}
                    </PlanInfo>

                    <ActionButton onClick={handleChangePlan}>
                        Alterar Plano
                    </ActionButton>
                </CardContent>
            </BillingCard>

            {/* Próxima Fatura */}
            <BillingCard>
                <CardHeader>
                    <FontAwesomeIcon icon={faCalendar} />
                    <h3>Próxima Fatura</h3>
                </CardHeader>
                <CardContent>
                    <NextBillHighlight>
                        <div className="total">
                            <span>Total a Pagar:</span>
                            <strong>{formatCurrency(billingInfo.next_bill.amount)}</strong>
                        </div>
                        <div className="due-date">
                            Vencimento: {formatDate(billingInfo.next_bill.due_date)}
                        </div>
                    </NextBillHighlight>

                    <BillBreakdown>
                        <BreakdownItem>
                            <span>Assinatura:</span>
                            <strong>{formatCurrency(billingInfo.next_bill.includes_subscription)}</strong>
                        </BreakdownItem>
                    </BillBreakdown>

                    <p style={{ 
                        fontSize: '0.9rem', 
                        color: 'var(--text-light)', 
                        marginTop: '1rem',
                        textAlign: 'center'
                    }}>
                        * R$ 0,50 por pedido realizado no catálogo online
                    </p>
                </CardContent>
            </BillingCard>
        </BillingContainer>
    );
}
