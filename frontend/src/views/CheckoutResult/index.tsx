import { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle, faTimesCircle, faClock } from "@fortawesome/free-solid-svg-icons";
import { StoreFrontHeader } from "../../components/StoreFrontHeader";
import { Loader } from "../../components/Loader";
import { getMercadoPagoPaymentStatus } from "../../services/mercadoPagoService";
import { convertMoney } from "../../utils";
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
    CountdownText,
    LoadingSpinner
} from "./style";

type ResultStatus = 'approved' | 'failure' | 'pending';

interface IPaymentInfo {
    id: number;
    status: string;
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
    const [countdown, setCountdown] = useState(15);

    // Parâmetros retornados pelo Mercado Pago
    const paymentId = searchParams.get('payment_id');
    const externalReference = searchParams.get('external_reference'); // order_id
    const mpStatus = searchParams.get('status');

    const status: ResultStatus = (resultStatus as ResultStatus) || 'pending';

    useEffect(() => {
        const fetchPaymentDetails = async () => {
            if (paymentId && slug) {
                try {
                    const details = await getMercadoPagoPaymentStatus(paymentId, slug);
                    setPaymentInfo(details);
                } catch (error) {
                    console.error("Erro ao buscar detalhes do pagamento:", error);
                }
            }
            setShowLoader(false);
        };

        setTimeout(fetchPaymentDetails, 2000);
    }, [paymentId, slug]);

    // Limpar carrinho quando chegar nas páginas de resultado
    useEffect(() => {
        clearCart();
    }, [clearCart]);

    // Countdown para redirecionar automaticamente após sucesso
    useEffect(() => {
        console.log("Status do pagamento:", status);
        if (status === 'approved' && !showLoader) {
            const timer = setInterval(() => {
                setCountdown((prev) => {
                    if (prev <= 1) {
                        clearInterval(timer);
                        navigate(`/${slug}`);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 4000);

            return () => clearInterval(timer);
        }
    }, [status, showLoader, navigate, slug]);

    const getStatusConfig = () => {
        switch (status) {
            case 'approved':
                return {
                    icon: faCheckCircle,
                    title: 'Pagamento Aprovado!',
                    message: 'Seu pagamento foi processado com sucesso. Seu pedido já está sendo preparado.',
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
                    message: 'Seu pagamento está sendo processado. Assim que tivermos uma atualização, você será notificado via e-mail.',
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
        // Podemos adicionar redirecionamento para WhatsApp da loja futuramente
        navigate(`/${slug}`);
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
            </Container>
        );
    }

    return (
        <Container>
            <Loader show={showLoader} />
            <StoreFrontHeader slug={slug} />
            
            <Content>
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
                            {mpStatus && (
                                <OrderInfoRow>
                                    <span>Status:</span>
                                    <span>
                                        {mpStatus === 'approved' && 'Aprovado ✅'}
                                        {mpStatus === 'pending' && 'Pendente ⏳'}
                                        {mpStatus === 'rejected' && 'Rejeitado ❌'}
                                        {mpStatus === 'in_process' && 'Em processamento ⏳'}
                                    </span>
                                </OrderInfoRow>
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

                    {status === 'approved' && (
                        <CountdownText>
                            Você será redirecionado em {countdown} segundo{countdown !== 1 ? 's' : ''}...
                        </CountdownText>
                    )}
                </ResultCard>
            </Content>
        </Container>
    );
}
