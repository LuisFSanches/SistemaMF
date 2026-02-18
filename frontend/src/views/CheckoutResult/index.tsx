import { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
    faCheckCircle, 
    faTimesCircle, 
    faClock, 
    faBox, 
    faTruck, 
    faCreditCard, 
    faMapMarkerAlt, 
    faEnvelope,
    faCheck
} from "@fortawesome/free-solid-svg-icons";
import moment from "moment";
import "moment/locale/pt-br";
import { StoreFrontHeader } from "../../components/StoreFrontHeader";
import { StoreFrontFooter } from "../../components/StoreFrontFooter";
import { Loader } from "../../components/Loader";
import { OrderStatusStepper, OrderStatusStep } from "../../components/OrderStatusStepper";
import { getMercadoPagoPaymentStatus } from "../../services/mercadoPagoService";
import { convertMoney, rawTelephone } from "../../utils";
import { useCart } from "../../contexts/CartContext";
import { IPaymentSuccessResponse } from "../../interfaces/IPaymentSuccessResponse";
import { MERCADO_PAGO_PAYMENT_METHODS } from "../../constants";

import {
    Container,
    Content,
    ResultCard,
    IconWrapper,
    Title,
    Message,
    ButtonsContainer,
    PrimaryButton,
    SecondaryButton,
    WhatsAppButton,
    LoadingSpinner,
    DetailsSection,
    SectionHeader,
    SectionIcon,
    SectionTitle,
    OrderItemsList,
    OrderItem,
    ItemImage,
    ItemImagePlaceholder,
    ItemDetails,
    ItemName,
    ItemDescription,
    ItemQuantityPrice,
    ItemTotal,
    FinancialSummary,
    FinancialRow,
    DeliveryInfo,
    InfoRow,
    InfoLabel,
    InfoValue,
    InfoBadge,
    PaymentInfo,
    PaymentMethodBadge,
    PaymentStatusBadge,
    NotesSection,
    NotesTitle,
    NotesText,
    CardMessageSection,
    CardMessageHeader,
    CardMessageText,
    CardMessageSignature,
} from "./style";

type ResultStatus = 'approved' | 'failure' | 'pending' | 'in_progress' | 'in_delivery' | 'done';

moment.locale('pt-br');

export function CheckoutResult() {
    const navigate = useNavigate();
    const { slug, status: resultStatus } = useParams<{ slug: string; status: string }>();
    const [searchParams] = useSearchParams();
    const { clearCart } = useCart();
    
    const [showLoader, setShowLoader] = useState(true);
    const [orderData, setOrderData] = useState<IPaymentSuccessResponse | null>(null);
    const [orderStep, setOrderStep] = useState<OrderStatusStep>('validating');

    // Parâmetros retornados pelo Mercado Pago
    const paymentId = searchParams.get('payment_id');

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
                    setOrderData(details);
                    setStatus(details.order.status as ResultStatus);

                    // Se o pagamento foi aprovado, para de fazer requisições
                    if (details.order.status === 'approved' ||
                        details.order.status === 'in_progress' ||
                        details.order.status === 'in_delivery' ||
                        details.order.status === 'done') {
                        setOrderStep(details.order.status as OrderStatusStep);
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
                    message: 'Seu pagamento foi processado com sucesso. Seu pedido foi entregue à loja e logo será preparado.',
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
            case 'in_progress':
                return {
                    icon: faClock,
                    title: 'Pedido em Produção',
                    message: 'Seu pedido está sendo preparado pela loja.',
                    showOrderInfo: true
                };
            case 'in_delivery':
                return {
                    icon: faTruck,
                    title: 'Pedido em Rota',
                    message: 'Seu pedido saiu para entrega e está a caminho do endereço informado.',
                    showOrderInfo: true
                };
            case 'done':
                return {
                    icon: faCheckCircle,
                    title: 'Pedido Entregue',
                    message: 'Seu pedido foi entregue com sucesso. Agradecemos pela preferência!',
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

    const getPaymentMethodLabel = (methodId: string) => {
        return MERCADO_PAGO_PAYMENT_METHODS[methodId] || methodId;
    };

    const handleGoToStore = () => {
        navigate(`/${slug}`);
    };

    const handleTryAgain = () => {
        navigate(`/${slug}/carrinho`);
    };

    const handleContactStore = () => {
        if (orderData?.store?.phone_number) {
            const cleanPhone = rawTelephone(orderData.store.phone_number);
            const message = encodeURIComponent(
                `Olá! Gostaria de obter informações sobre meu pedido #${orderData?.order?.order_code}.`
            );
            const whatsappUrl = `https://wa.me/55${cleanPhone}?text=${message}`;
            window.open(whatsappUrl, '_blank');
        } else {
            navigate(`/${slug}`);
        }
    };

    const formatAddress = () => {
        if (!orderData?.delivery?.address) return '';
        
        const addr = orderData.delivery.address;
        return `${addr.street}, ${addr.number}${addr.complement ? ` - ${addr.complement}` : ''}, ${addr.neighborhood}, ${addr.city} - ${addr.state}${addr.zip_code ? `, CEP: ${addr.zip_code}` : ''}`;
    };

    const formatDeliveryDate = (dateStr: string) => {
        return moment(dateStr).format('DD [de] MMMM [de] YYYY [(]dddd[)]');
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

                    {orderData && (
                        <>
                            <InfoRow style={{ textAlign: 'center', marginBottom: '8px' }}>
                                <InfoLabel>Número do Pedido</InfoLabel>
                                <InfoValue style={{ fontSize: '20px', fontWeight: '600', color: 'var(--primary-color)' }}>
                                    #{orderData.order.order_code}
                                </InfoValue>
                            </InfoRow>
                        </>
                    )}

                    <ButtonsContainer>
                        {status === 'approved' && (
                            <>
                                <PrimaryButton onClick={handleGoToStore}>
                                    Voltar para a Loja
                                </PrimaryButton>
                                <WhatsAppButton onClick={handleContactStore}>
                                    Contatar a Loja
                                </WhatsAppButton>
                            </>
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

                {/* Seção de Produtos */}
                {config.showOrderInfo && orderData && orderData.items && orderData.items.length > 0 && (
                    <DetailsSection>
                        <SectionHeader>
                            <SectionIcon>
                                <FontAwesomeIcon icon={faBox} />
                            </SectionIcon>
                            <SectionTitle>📦 Itens do Pedido</SectionTitle>
                        </SectionHeader>

                        <OrderItemsList>
                            {orderData.items.map((item) => (
                                <OrderItem key={item.id}>
                                    {item.image_url ? (
                                        <ItemImage src={item.image_url} alt={item.product_name} />
                                    ) : (
                                        <ItemImagePlaceholder>
                                            <FontAwesomeIcon icon={faBox} />
                                        </ItemImagePlaceholder>
                                    )}
                                    
                                    <ItemDetails>
                                        <ItemName>{item.product_name}</ItemName>
                                        {item.description && (
                                            <ItemDescription>{item.description}</ItemDescription>
                                        )}
                                        <ItemQuantityPrice>
                                            <span>Quantidade: {item.quantity}</span>
                                            <span>•</span>
                                            <span>Unitário: {convertMoney(item.unit_price)}</span>
                                        </ItemQuantityPrice>
                                    </ItemDetails>
                                    
                                    <ItemTotal>{convertMoney(item.total_price)}</ItemTotal>
                                </OrderItem>
                            ))}
                        </OrderItemsList>

                        {orderData.financial && (
                            <FinancialSummary>
                                <FinancialRow>
                                    <span>Subtotal</span>
                                    <span>{convertMoney(orderData.financial.subtotal)}</span>
                                </FinancialRow>
                                <FinancialRow>
                                    <span>Taxa de Entrega</span>
                                    <span>{convertMoney(orderData.financial.delivery_fee)}</span>
                                </FinancialRow>
                                {orderData.financial.discount && orderData.financial.discount > 0 && (
                                    <FinancialRow>
                                        <span>Desconto</span>
                                        <span>- {convertMoney(orderData.financial.discount)}</span>
                                    </FinancialRow>
                                )}
                                <FinancialRow isTotal>
                                    <span>Total</span>
                                    <span>{convertMoney(orderData.financial.total_amount)}</span>
                                </FinancialRow>
                            </FinancialSummary>
                        )}
                    </DetailsSection>
                )}

                {/* Seção de Entrega */}
                {config.showOrderInfo && orderData && orderData.delivery && (
                    <DetailsSection>
                        <SectionHeader>
                            <SectionIcon>
                                {orderData.delivery.is_pickup ? (
                                    <FontAwesomeIcon icon={faMapMarkerAlt} />
                                ) : (
                                    <FontAwesomeIcon icon={faTruck} />
                                )}
                            </SectionIcon>
                            <SectionTitle>
                                {orderData.delivery.is_pickup ? '📍 Retirada na Loja' : '🚚 Informações de Entrega'}
                            </SectionTitle>
                        </SectionHeader>

                        <DeliveryInfo>
                            <InfoRow>
                                <InfoLabel>Tipo de Entrega</InfoLabel>
                                <InfoBadge type={orderData.delivery.is_pickup ? 'pickup' : 'delivery'}>
                                    {orderData.delivery.is_pickup ? 'Retirada na Loja' : 'Entrega em Domicílio'}
                                </InfoBadge>
                            </InfoRow>

                            {!orderData.delivery.is_pickup && orderData.delivery.address && (
                                <InfoRow>
                                    <InfoLabel>Endereço de Entrega</InfoLabel>
                                    <InfoValue>{formatAddress()}</InfoValue>
                                    {orderData.delivery.address.reference && (
                                        <InfoValue style={{ fontSize: '14px', color: '#666', marginTop: '4px' }}>
                                            <strong>Referência:</strong> {orderData.delivery.address.reference}
                                        </InfoValue>
                                    )}
                                </InfoRow>
                            )}

                            <InfoRow>
                                <InfoLabel>Data Prevista</InfoLabel>
                                <InfoValue>{formatDeliveryDate(orderData.delivery.delivery_date)}</InfoValue>
                            </InfoRow>

                            <InfoRow>
                                <InfoLabel>Recebedor</InfoLabel>
                                <InfoValue>{orderData.delivery.receiver_name}</InfoValue>
                            </InfoRow>

                            <InfoRow>
                                <InfoLabel>Telefone do Recebedor</InfoLabel>
                                <InfoValue>{orderData.delivery.receiver_phone}</InfoValue>
                            </InfoRow>
                        </DeliveryInfo>
                    </DetailsSection>
                )}

                {/* Seção de Pagamento */}
                {config.showOrderInfo && orderData && orderData.payment && (
                    <DetailsSection>
                        <SectionHeader>
                            <SectionIcon>
                                <FontAwesomeIcon icon={faCreditCard} />
                            </SectionIcon>
                            <SectionTitle>💳 Informações de Pagamento</SectionTitle>
                        </SectionHeader>

                        <PaymentInfo>
                            <InfoRow>
                                <InfoLabel>Método de Pagamento</InfoLabel>
                                <PaymentMethodBadge>
                                    <FontAwesomeIcon icon={faCreditCard} />
                                    {getPaymentMethodLabel(orderData.payment.method_id)}
                                </PaymentMethodBadge>
                            </InfoRow>

                            <InfoRow>
                                <InfoLabel>Status do Pagamento</InfoLabel>
                                <PaymentStatusBadge status={orderData.payment.status}>
                                    <FontAwesomeIcon icon={faCheck} />
                                    {orderData.payment.status === 'approved' ? 'Pago' : 'Pendente'}
                                </PaymentStatusBadge>
                            </InfoRow>

                            {orderData.payment.date_approved && (
                                <InfoRow>
                                    <InfoLabel>Data de Aprovação</InfoLabel>
                                    <InfoValue>
                                        {moment(orderData.payment.date_approved).format('DD/MM/YYYY [às] HH:mm')}
                                    </InfoValue>
                                </InfoRow>
                            )}

                            <InfoRow>
                                <InfoLabel>ID da Transação</InfoLabel>
                                <InfoValue style={{ fontSize: '14px', fontFamily: 'monospace' }}>
                                    {orderData.payment.id}
                                </InfoValue>
                            </InfoRow>
                        </PaymentInfo>
                    </DetailsSection>
                )}

                {/* Seção de Observações e Cartão */}
                {config.showOrderInfo && orderData && orderData.additional_info && (
                    <>
                        {orderData.additional_info.notes && (
                            <DetailsSection>
                                <SectionHeader>
                                    <SectionIcon>📝</SectionIcon>
                                    <SectionTitle>Observações</SectionTitle>
                                </SectionHeader>
                                <NotesSection>
                                    <NotesTitle>Observações do Pedido</NotesTitle>
                                    <NotesText>{orderData.additional_info.notes}</NotesText>
                                </NotesSection>
                            </DetailsSection>
                        )}

                        {orderData.additional_info.card_message?.has_card && (
                            <DetailsSection>
                                <SectionHeader>
                                    <SectionIcon>
                                        <FontAwesomeIcon icon={faEnvelope} />
                                    </SectionIcon>
                                    <SectionTitle>💌 Mensagem do Cartão</SectionTitle>
                                </SectionHeader>
                                <CardMessageSection>
                                    <CardMessageHeader>
                                        <FontAwesomeIcon icon={faEnvelope} />
                                        Cartão Presente
                                    </CardMessageHeader>
                                    {orderData.additional_info.card_message.message && (
                                        <CardMessageText>
                                            "{orderData.additional_info.card_message.message}"
                                        </CardMessageText>
                                    )}
                                    {(orderData.additional_info.card_message.from || orderData.additional_info.card_message.to) && (
                                        <CardMessageSignature>
                                            {orderData.additional_info.card_message.from && (
                                                <div>De: <strong>{orderData.additional_info.card_message.from}</strong></div>
                                            )}
                                            {orderData.additional_info.card_message.to && (
                                                <div>Para: <strong>{orderData.additional_info.card_message.to}</strong></div>
                                            )}
                                        </CardMessageSignature>
                                    )}
                                </CardMessageSection>
                            </DetailsSection>
                        )}
                    </>
                )}
            </Content>
            
            <StoreFrontFooter />
        </Container>
    );
}
