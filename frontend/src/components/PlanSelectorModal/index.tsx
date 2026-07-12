import { useEffect, useState } from 'react';
import Modal from 'react-modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark, faClock, faCheck } from "@fortawesome/free-solid-svg-icons";
import { ModalContainer, PrimaryButton } from '../../styles/global';
import { 
    ModalContent, 
    TrialWarning, 
    PlansContainer, 
    PlanCard, 
    PlanHeader,
    PlanPrice,
    PlanFeatures,
    PlanFooter,
    LoadingContainer
} from './style';
import { useSubscription } from '../../contexts/SubscriptionContext';
import { getStoreId } from '../../services/api';

interface PlanSelectorModalProps {
    isOpen: boolean;
    onRequestClose: () => void;
}

export function PlanSelectorModal({
    isOpen,
    onRequestClose
}: PlanSelectorModalProps) {
    const { 
        plans, 
        subscriptionStatus, 
        loadPlans, 
        createSubscription, 
        loading 
    } = useSubscription();
    
    const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
    const [isCreating, setIsCreating] = useState(false);

    useEffect(() => {
        if (isOpen) {
            loadPlans();
        }
    }, [isOpen, loadPlans]);

    const handleSelectPlan = async (planId: string) => {
        const storeId = getStoreId();
        
        if (!storeId) {
            alert('Erro ao identificar a loja. Faça login novamente.');
            return;
        }

        setSelectedPlanId(planId);
        setIsCreating(true);

        try {
            await createSubscription({
                store_id: storeId,
                subscription_plan_id: planId
            });
            
            alert('Assinatura criada com sucesso!');
            onRequestClose();
        } catch (error: any) {
            console.error('Erro ao criar assinatura:', error);
            alert(error?.response?.data?.message || 'Erro ao criar assinatura. Tente novamente.');
        } finally {
            setIsCreating(false);
            setSelectedPlanId(null);
        }
    };

    const formatPrice = (price: number) => {
        return price.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        });
    };

    const getBillingCycleText = (cycle: string) => {
        return cycle === 'MONTHLY' ? 'por mês' : 'por mês (cobrado anualmente)';
    };

    const daysRemaining = subscriptionStatus?.days_remaining ?? 0;

    return (
        <Modal 
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            overlayClassName="react-modal-overlay"
            className="react-modal-content-wide"
        >
            <button 
                type="button" 
                onClick={onRequestClose} 
                className="modal-close"
            >
                <FontAwesomeIcon icon={faXmark} />
            </button>

            <ModalContainer>
                <ModalContent>
                    <h2>Escolha seu Plano</h2>
                    
                    {subscriptionStatus?.is_trial && (
                        <TrialWarning>
                            <FontAwesomeIcon icon={faClock} />
                            <span>
                                Seu período trial termina em <strong>{daysRemaining} {daysRemaining === 1 ? 'dia' : 'dias'}</strong>. 
                                Escolha um plano para continuar usando o sistema.
                            </span>
                        </TrialWarning>
                    )}

                    {loading && !isCreating ? (
                        <LoadingContainer>
                            <p style={{ textAlign: 'center', color: 'var(--text-light)' }}>Carregando planos...</p>
                        </LoadingContainer>
                    ) : (
                        <PlansContainer>
                            {plans.map((plan) => (
                                <PlanCard key={plan.id} isRecommended={plan.billing_cycle === 'ANNUAL'}>
                                    {plan.billing_cycle === 'ANNUAL' && (
                                        <div className="recommended-badge">Recomendado</div>
                                    )}
                                    
                                    <PlanHeader>
                                        <h3>{plan.name}</h3>
                                        <p>{plan.description}</p>
                                    </PlanHeader>

                                    <PlanPrice>
                                        <div className="price">
                                            {formatPrice(plan.price)}
                                        </div>
                                        <div className="cycle">
                                            {getBillingCycleText(plan.billing_cycle)}
                                        </div>
                                    </PlanPrice>

                                    <PlanFeatures>
                                        <li>
                                            <FontAwesomeIcon icon={faCheck} />
                                            <span>Acesso completo ao sistema</span>
                                        </li>
                                        <li>
                                            <FontAwesomeIcon icon={faCheck} />
                                            <span>Gerenciamento de pedidos ilimitados</span>
                                        </li>
                                        <li>
                                            <FontAwesomeIcon icon={faCheck} />
                                            <span>Controle de estoque</span>
                                        </li>
                                        <li>
                                            <FontAwesomeIcon icon={faCheck} />
                                            <span>Relatórios e análises</span>
                                        </li>
                                        <li>
                                            <FontAwesomeIcon icon={faCheck} />
                                            <span>Integração com Mercado Pago</span>
                                        </li>
                                        <li>
                                            <FontAwesomeIcon icon={faCheck} />
                                            <span>R$ 0,50 por pedido no catálogo online</span>
                                        </li>
                                        {plan.billing_cycle === 'ANNUAL' && (
                                            <li className="highlight">
                                                <FontAwesomeIcon icon={faCheck} />
                                                <span><strong>Economize R$ 120 por ano!</strong></span>
                                            </li>
                                        )}
                                    </PlanFeatures>

                                    <PlanFooter>
                                        <PrimaryButton 
                                            onClick={() => handleSelectPlan(plan.id)}
                                            disabled={isCreating}
                                        >
                                            {isCreating && selectedPlanId === plan.id ? (
                                                'Processando...'
                                            ) : (
                                                'Assinar Agora'
                                            )}
                                        </PrimaryButton>
                                    </PlanFooter>
                                </PlanCard>
                            ))}
                        </PlansContainer>
                    )}

                    <p style={{ textAlign: 'center', color: 'var(--text-light)', marginTop: '2rem' }}>
                        * Pedidos criados no balcão e outros canais são gratuitos. 
                        Apenas pedidos do catálogo online custam R$ 0,50 cada (cobrança mensal).
                    </p>
                </ModalContent>
            </ModalContainer>
        </Modal>
    );
}
