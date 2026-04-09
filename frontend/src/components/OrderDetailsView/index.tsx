import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
    faBox, 
    faEnvelope,
    faCheck
} from "@fortawesome/free-solid-svg-icons";
import moment from "moment";
// @ts-ignore - locale import
import "moment/locale/pt-br";
import { StoreFrontHeader } from "../StoreFrontHeader";
import { StoreFrontFooter } from "../StoreFrontFooter";
import { Loader } from "../Loader";
import { OrderStatusStepper, OrderStatusStep } from "../OrderStatusStepper";
import { convertMoney } from "../../utils";
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
    SectionTitle,
    SectionIcon,
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
} from "../../views/CheckoutResult/style";

type ResultStatus = 'approved' | 'failure' | 'pending' | 'in_progress' | 'in_delivery' | 'done';

interface StatusConfig {
    icon: any;
    title: string;
    message: string;
    showOrderInfo: boolean;
}

interface OrderDetailsViewProps {
    slug?: string;
    status: ResultStatus;
    orderData: IPaymentSuccessResponse | null;
    orderStep: OrderStatusStep;
    showLoader?: boolean;
    loadingMessage?: string;
    onGoToStore: () => void;
    onTryAgain?: () => void;
    onContactStore: () => void;
}

moment.locale('pt-br');

export function OrderDetailsView({
    slug,
    status,
    orderData,
    orderStep,
    showLoader = false,
    loadingMessage = "Verificando status do pagamento...",
    onGoToStore,
    onTryAgain,
    onContactStore
}: OrderDetailsViewProps) {
    
    const getStatusConfig = (): StatusConfig => {
        switch (status) {
            case 'approved':
                return {
                    icon: require('@fortawesome/free-solid-svg-icons').faCheckCircle,
                    title: 'Pagamento Aprovado!',
                    message: 'Seu pagamento foi processado com sucesso. Seu pedido foi entregue à loja e logo será preparado.',
                    showOrderInfo: true
                };
            case 'failure':
                return {
                    icon: require('@fortawesome/free-solid-svg-icons').faTimesCircle,
                    title: 'Pagamento Não Aprovado',
                    message: 'Infelizmente não foi possível processar seu pagamento. Você pode tentar novamente ou escolher outra forma de pagamento.',
                    showOrderInfo: false
                };
            case 'pending':
                return {
                    icon: require('@fortawesome/free-solid-svg-icons').faClock,
                    title: 'Pagamento Pendente',
                    message: 'Estamos processando seu pagamento, aguarde um momento.',
                    showOrderInfo: true
                };
            case 'in_progress':
                return {
                    icon: require('@fortawesome/free-solid-svg-icons').faClock,
                    title: 'Pedido em Produção',
                    message: 'Seu pedido está sendo preparado pela loja.',
                    showOrderInfo: true
                };
            case 'in_delivery':
                return {
                    icon: require('@fortawesome/free-solid-svg-icons').faTruck,
                    title: 'Pedido em Rota',
                    message: 'Seu pedido saiu para entrega e está a caminho do endereço informado.',
                    showOrderInfo: true
                };
            case 'done':
                return {
                    icon: require('@fortawesome/free-solid-svg-icons').faCheckCircle,
                    title: 'Pedido Entregue',
                    message: 'Seu pedido foi entregue com sucesso. Agradecemos pela preferência!',
                    showOrderInfo: true
                };
            default:
                return {
                    icon: require('@fortawesome/free-solid-svg-icons').faClock,
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
                        <Message>{loadingMessage}</Message>
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
                                <PrimaryButton onClick={onGoToStore}>
                                    Voltar para a Loja
                                </PrimaryButton>
                                <WhatsAppButton onClick={onContactStore}>
                                    Contatar a Loja
                                </WhatsAppButton>
                            </>
                        )}
                        
                        {status === 'failure' && (
                            <>
                                <PrimaryButton onClick={onTryAgain}>
                                    Tentar Novamente
                                </PrimaryButton>
                                <SecondaryButton onClick={onContactStore}>
                                    Contatar a Loja
                                </SecondaryButton>
                            </>
                        )}
                        
                        {status === 'pending' && (
                            <>
                                <PrimaryButton onClick={onGoToStore}>
                                    Voltar para a Loja
                                </PrimaryButton>
                                <SecondaryButton onClick={onContactStore}>
                                    Contatar a Loja
                                </SecondaryButton>
                            </>
                        )}
                        
                        {(status === 'in_progress' || status === 'in_delivery' || status === 'done') && (
                            <>
                                <PrimaryButton onClick={onGoToStore}>
                                    Voltar para a Loja
                                </PrimaryButton>
                                <WhatsAppButton onClick={onContactStore}>
                                    Contatar a Loja
                                </WhatsAppButton>
                            </>
                        )}
                    </ButtonsContainer>
                </ResultCard>

                {/* Seção de Produtos */}
                {config.showOrderInfo && orderData && orderData.items && orderData.items.length > 0 && (
                    <DetailsSection>
                        <SectionHeader>
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
                                {orderData.financial.discount !== undefined && 
                                 orderData.financial.discount !== null && 
                                 Number(orderData.financial.discount) > 0 && (
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
                            <SectionTitle>💳 Informações de Pagamento</SectionTitle>
                        </SectionHeader>

                        <PaymentInfo>
                            <InfoRow>
                                <InfoLabel>Método de Pagamento</InfoLabel>
                                <PaymentMethodBadge>
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
