import { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle, faTimesCircle, faClock } from "@fortawesome/free-solid-svg-icons";
import { StoreFrontHeader } from "../../components/StoreFrontHeader";
import { StoreFrontFooter } from "../../components/StoreFrontFooter";
import { Loader } from "../../components/Loader";
import { OrderStatusStepper, OrderStatusStep } from "../../components/OrderStatusStepper";
import { getMercadoPagoPaymentStatus } from "../../services/mercadoPagoService";
import { convertMoney, rawTelephone } from "../../utils";
import { useCart } from "../../contexts/CartContext";

import {
    Container,
    Content,
    ResultCard,
    IconWrapper,
    Title,
    Message,
    OrderInfo,
    OrderInfoRow,
    ButtonsContainer,
    PrimaryButton,
    SecondaryButton,
    LoadingSpinner
} from "./style";

type ResultStatus = 'approved' | 'failure' | 'pending';

interface IPaymentInfo {
    id: number;
    transaction_amount: number;
    payment_method_id: string;
    payment_type_id: string;
    order_code: string;
}

export function CheckoutResult() {
    const navigate = useNavigate();
    const { slug, status: resultStatus } = useParams<{ slug: string; status: string }>();
    const [searchParams] = useSearchParams();
    const { clearCart } = useCart();
    
    const [showLoader, setShowLoader] = useState(true);
    const [paymentInfo, setPaymentInfo] = useState<IPaymentInfo | null>(null);
    const [orderStep, setOrderStep] = useState<OrderStatusStep>('validating');

    // Parâmetros retornados pelo Mercado Pago
    const paymentId = searchParams.get('payment_id');
    const externalReference = searchParams.get('external_reference'); // order_id

    const initialStatus: ResultStatus = (resultStatus as ResultStatus) || 'pending';
    const [status, setStatus] = useState<ResultStatus>(initialStatus);

    useEffect(() => {
        let attemptCount = 0;
        const maxAttempts = 5;
        const intervalTime = 10000;
        let intervalId: NodeJS.Timeout;

        const fetchPaymentDetails = async () => {
            if (paymentId && slug) {
                try {
                    attemptCount++;
                    
                    const details = await getMercadoPagoPaymentStatus(paymentId, slug);
                    setPaymentInfo(details);
                    setStatus(details.status as ResultStatus);

                    // Se o pagamento foi aprovado, para de fazer requisições
                    if (details.status === 'approved') {
                        setOrderStep('received');
                        clearInterval(intervalId);
                        setShowLoader(false);
                    } else if (attemptCount >= maxAttempts) {
                        clearInterval(intervalId);
                        setShowLoader(false);
                    }
                } catch (error) {
                    console.error("Erro ao buscar detalhes do pagamento:", error);
                    
                    if (attemptCount >= maxAttempts) {
                        clearInterval(intervalId);
                        setShowLoader(false);
                    }
                }
            } else {
                setShowLoader(false);
            }
        };

        const initialTimeout = setTimeout(() => {
            fetchPaymentDetails();
            
            intervalId = setInterval(() => {
                if (attemptCount < maxAttempts) {
                    fetchPaymentDetails();
                } else {
                    clearInterval(intervalId);
                }
            }, intervalTime);
        }, 2000);

        // Cleanup function
        return () => {
            clearTimeout(initialTimeout);
            if (intervalId) {
                clearInterval(intervalId);
            }
        };
    }, [paymentId, slug]);

    // Limpar carrinho quando chegar nas páginas de resultado
    useEffect(() => {
        clearCart();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const getStatusConfig = () => {
        switch (status) {
            case 'approved':
                return {
                    icon: faCheckCircle,
                    title: 'Pagamento Aprovado!',
                    message: 'Seu pagamento foi processado com sucesso. Seu pedido foi entregue a loja e logo será preparado.',
                    showOrderInfo: true
                };
            case 'failure':
                return {
                    icon: faTimesCircle,
                    title: 'Pagamento Não Aprovado',
                    message: 'Infelizmente não foi possível processar seu pagamento. Você pode tentar novamente ou escolher outra forma de pagamento.',
                    showOrderInfo: false
                };
            case 'pending':
                return {
                    icon: faClock,
                    title: 'Pagamento Pendente',
                    message: 'Estamos processando seu pagamento, aguarde um momento.',
                    showOrderInfo: true
                };
            default:
                return {
                    icon: faClock,
                    title: 'Processando...',
                    message: 'Estamos verificando o status do seu pagamento.',
                    showOrderInfo: false
                };
        }
    };

    const config = getStatusConfig();

    const getPaymentMethodLabel = (methodId: string | undefined) => {
        if (!methodId) return 'N/A';
        
        const methods: Record<string, string> = {
            'pix': 'PIX',
            'credit_card': 'Cartão de Crédito',
            'debit_card': 'Cartão de Débito',
            'bolbradesco': 'Boleto Bancário',
            'account_money': 'Mercado Pago',
        };
        
        return methods[methodId] || methodId;
    };

    const handleGoToStore = () => {
        navigate(`/${slug}`);
    };

    const handleTryAgain = () => {
        navigate(`/${slug}/carrinho`);
    };

    const handleContactStore = () => {
        const storePhone = localStorage.getItem('storefront_store_phone');
        
        if (storePhone) {
            const cleanPhone = rawTelephone(storePhone);
            const message = encodeURIComponent('Olá! Gostaria de obter informações sobre meu pedido.');
            const whatsappUrl = `https://wa.me/55${cleanPhone}?text=${message}`;
            window.open(whatsappUrl, '_blank');
        } else {
            navigate(`/${slug}`);
        }
    };

    if (showLoader) {
        return (
            <Container>
                <StoreFrontHeader slug={slug} />
                <Content>
                    <ResultCard>
                        <LoadingSpinner />
                        <Message>Verificando status do pagamento...</Message>
                    </ResultCard>
                </Content>
                <StoreFrontFooter />
            </Container>
        );
    }

    return (
        <Container>
            <Loader show={showLoader} />
            <StoreFrontHeader slug={slug} />
            
            <Content>
                <OrderStatusStepper currentStep={orderStep} />
                
                <ResultCard>
                    <IconWrapper status={status}>
                        <FontAwesomeIcon icon={config.icon} />
                    </IconWrapper>

                    <Title status={status}>{config.title}</Title>
                    <Message>{config.message}</Message>

                    {config.showOrderInfo && (
                        <OrderInfo>
                            {externalReference && (
                                <OrderInfoRow>
                                    <span>Pedido:</span>
                                    <span>#{paymentInfo?.order_code}</span>
                                </OrderInfoRow>
                            )}
                            {paymentInfo && (
                                <>
                                    <OrderInfoRow>
                                        <span>Valor:</span>
                                        <span>{convertMoney(paymentInfo.transaction_amount)}</span>
                                    </OrderInfoRow>
                                    <OrderInfoRow>
                                        <span>Forma de Pagamento:</span>
                                        <span>{getPaymentMethodLabel(paymentInfo.payment_method_id)}</span>
                                    </OrderInfoRow>
                                </>
                            )}
                        </OrderInfo>
                    )}

                    <ButtonsContainer>
                        {status === 'approved' && (
                            <PrimaryButton onClick={handleGoToStore}>
                                Voltar para a Loja
                            </PrimaryButton>
                        )}
                        
                        {status === 'failure' && (
                            <>
                                <PrimaryButton onClick={handleTryAgain}>
                                    Tentar Novamente
                                </PrimaryButton>
                                <SecondaryButton onClick={handleContactStore}>
                                    Contatar a Loja
                                </SecondaryButton>
                            </>
                        )}
                        
                        {status === 'pending' && (
                            <>
                                <PrimaryButton onClick={handleGoToStore}>
                                    Voltar para a Loja
                                </PrimaryButton>
                                <SecondaryButton onClick={handleContactStore}>
                                    Contatar a Loja
                                </SecondaryButton>
                            </>
                        )}
                    </ButtonsContainer>
                </ResultCard>
            </Content>
            
            <StoreFrontFooter />
        </Container>
    );
}
