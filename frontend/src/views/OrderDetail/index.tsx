import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import moment from 'moment';
import 'moment/locale/pt-br';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faArrowLeft,
    faDollarSign,
    faCalendarAlt,
    faUser,
    faTruck,
    faMapMarkerAlt,
    faInfoCircle,
    faCheckCircle,
    faHourglassHalf,
    faInbox,
    faCreditCard,
    faEnvelope,
    faShoppingBag,
    faGifts,
    faPen
} from "@fortawesome/free-solid-svg-icons";
import { getOrderById } from "../../services/orderService";
import { convertMoney, formatTitleCase, formatTelephone, formatDescriptionWithPrice } from "../../utils";
import { Loader } from "../../components/Loader";
import { PrintCardMessage } from "../../components/PrintCardMessage";
import { EditOrderModal } from "../../components/EditOrderModal";
import { STATUS_LABEL, PAYMENT_METHODS } from "../../constants";
import {
    Container,
    Header,
    MetricsGrid,
    MetricCard,
    InfoSection,
    StatusBadge,
    EmptyState,
    InfoSectionDetail,
    PrintCardButton
} from "./style";

moment.locale('pt-br');

interface IOrderDetail {
    orderInfo: {
        code: number;
        description: string;
        additional_information: string;
        delivery_date: string;
        is_delivery: boolean;
        online_order: boolean;
        store_front_order: boolean;
        status: string;
    };
    createdBy: {
        id: string;
        name: string;
        username: string;
    };
    orderValues: {
        products_value: number;
        discount: number;
        delivery_fee: number;
        total: number;
        payment_method: string;
        payment_received: boolean;
    };
    cardDetails: {
        card_from: string;
        card_to: string;
        card_message: string;
    } | null;
    clientInfo: {
        id: string;
        first_name: string;
        last_name: string;
        phone_number: string;
        address: {
            street: string;
            street_number: string;
            complement: string;
            neighborhood: string;
            reference_point: string;
            city: string;
            state: string;
            postal_code: string;
        } | null;
    };
    deliveryManInfo: {
        id: string;
        name: string;
        phone_number: string;
    } | null;
}

export function OrderDetail() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [orderData, setOrderData] = useState<IOrderDetail | null>(null);
    const [isCardModalOpen, setIsCardModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [orderForEdit, setOrderForEdit] = useState<any>(null);

    useEffect(() => {
        const fetchOrderData = async () => {
            try {
                setLoading(true);
                const response = await getOrderById(id as string);
                setOrderData(response.data);
                
                // Estrutura o objeto de pedido completo para o modal de edição
                const fullOrder = {
                    id: id,
                    code: response.data.orderInfo.code,
                    description: response.data.orderInfo.description,
                    additional_information: response.data.orderInfo.additional_information,
                    delivery_date: response.data.orderInfo.delivery_date,
                    is_delivery: response.data.orderInfo.is_delivery,
                    online_order: response.data.orderInfo.online_order,
                    store_front_order: response.data.orderInfo.store_front_order,
                    status: response.data.orderInfo.status,
                    client_id: response.data.clientInfo.id,
                    client: {
                        id: response.data.clientInfo.id,
                        first_name: response.data.clientInfo.first_name,
                        last_name: response.data.clientInfo.last_name,
                        phone_number: response.data.clientInfo.phone_number,
                    },
                    clientAddress: response.data.clientInfo.address || {},
                    client_address_id: response.data.clientInfo.address?.id,
                    receiver_name: response.data.orderInfo.receiver_name,
                    receiver_phone: response.data.orderInfo.receiver_phone,
                    products_value: response.data.orderValues.products_value,
                    discount: response.data.orderValues.discount,
                    delivery_fee: response.data.orderValues.delivery_fee,
                    total: response.data.orderValues.total,
                    payment_method: response.data.orderValues.payment_method,
                    payment_received: response.data.orderValues.payment_received,
                    has_card: response.data.cardDetails ? true : false,
                    card_message: response.data.cardDetails?.card_message,
                    card_from: response.data.cardDetails?.card_from,
                    card_to: response.data.cardDetails?.card_to,
                    pickup_on_store: !response.data.orderInfo.is_delivery,
                    orderItems: response.data.orderItems || []
                };
                
                setOrderForEdit(fullOrder);
            } catch (error) {
                console.error("Error fetching order data:", error);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchOrderData();
        }
    }, [id]);

    if (loading) {
        return <Loader show />;
    }

    if (!orderData) {
        return (
            <Container>
                <EmptyState>
                    <div className="icon">
                        <FontAwesomeIcon icon={faInbox} />
                    </div>
                    <h3>Pedido não encontrado</h3>
                    <p>Não foi possível carregar as informações deste pedido</p>
                </EmptyState>
            </Container>
        );
    }

    const { orderInfo, orderValues, cardDetails, clientInfo, deliveryManInfo, createdBy } = orderData;

    // Get order type badge
    const getOrderTypeBadge = () => {
        if (orderInfo.online_order && !orderInfo.store_front_order) {
            return <span className="type-badge whatsapp">Whatsapp</span>;
        }
        if (orderInfo.online_order && orderInfo.store_front_order) {
            return <span className="type-badge online">Online</span>;
        }
        if (orderInfo.store_front_order) {
            return <span className="type-badge pdv">PDV</span>;
        }
        return <span className="type-badge on_store">Balcão</span>;
    };

    return (
        <Container>
            <Header>
                <div className="order-info-container">
                    <button className="back-button" onClick={() => navigate(-1)}>
                        <FontAwesomeIcon icon={faArrowLeft} />
                    </button>
                    <div className="order-info">
                        <h1>
                            <span className="order-code">#{orderInfo.code}</span>
                            {getOrderTypeBadge()}
                        </h1>
                        <div className="order-meta">
                            <p className="delivery-date">
                                <FontAwesomeIcon icon={faCalendarAlt} />
                                {orderInfo.is_delivery ? 'Entrega' : 'Retirada'} em {moment(orderInfo.delivery_date).format('DD/MM/YYYY')}
                            </p>
                            <p className="order-status">
                                <FontAwesomeIcon icon={faInfoCircle} />
                                Status: <strong>{STATUS_LABEL[orderInfo.status as keyof typeof STATUS_LABEL] || orderInfo.status}</strong>
                            </p>
                            <p className="created-by">
                                <FontAwesomeIcon icon={faUser} />
                                Responsável: <strong>{formatTitleCase(createdBy?.name)}</strong>
                            </p>
                        </div>
                    </div>
                    <button 
                        className="edit-button"
                        onClick={() => setIsEditModalOpen(true)}
                    >
                        <FontAwesomeIcon icon={faPen} />
                        Editar
                    </button>
                </div>
            </Header>

            <InfoSection>
                <h2>
                    <FontAwesomeIcon icon={faGifts} />
                    Descrição do Pedido
                </h2>
                <div className="description-items">
                    {formatDescriptionWithPrice(orderInfo.description).map((item, index) => (
                        <div key={index} className="description-item">
                            {item}
                        </div>
                    ))}
                </div>
            </InfoSection>

            <MetricsGrid>
                <MetricCard color="#ec4899">
                    <div className="metric-header">
                        <div className="icon">
                            <FontAwesomeIcon icon={faShoppingBag} />
                        </div>
                        <div className="metric-label">Valor Produtos</div>
                    </div>
                    <div className="metric-value">{convertMoney(orderValues.products_value)}</div>
                    <div className="metric-trend neutral">
                        Valor base do pedido
                    </div>
                </MetricCard>

                {orderValues.delivery_fee > 0 && (
                    <MetricCard color="#f59e0b">
                        <div className="metric-header">
                            <div className="icon">
                                <FontAwesomeIcon icon={faTruck} />
                            </div>
                            <div className="metric-label">Taxa de Entrega</div>
                        </div>
                        <div className="metric-value">{convertMoney(orderValues.delivery_fee)}</div>
                        <div className="metric-trend neutral">
                            Custo de entrega
                        </div>
                    </MetricCard>
                )}

                {orderValues.discount > 0 && (
                    <MetricCard color="#8b5cf6">
                        <div className="metric-header">
                            <div className="icon">
                                <FontAwesomeIcon icon={faDollarSign} />
                            </div>
                            <div className="metric-label">Desconto</div>
                        </div>
                        <div className="metric-value">{convertMoney(orderValues.discount)}</div>
                        <div className="metric-trend neutral">
                            Desconto aplicado
                        </div>
                    </MetricCard>
                )}

                <MetricCard color="#10b981">
                    <div className="metric-header">
                        <div className="icon">
                            <FontAwesomeIcon icon={faDollarSign} />
                        </div>
                        <div className="metric-label">Total</div>
                    </div>
                    <div className="metric-value">{convertMoney(orderValues.total)}</div>
                    <div className="metric-trend neutral">
                        Valor final
                    </div>
                </MetricCard>

                <MetricCard color="#3b82f6">
                    <div className="metric-header">
                        <div className="icon">
                            <FontAwesomeIcon icon={faCreditCard} />
                        </div>
                        <div className="metric-label">Pagamento</div>
                    </div>
                    <div className="metric-value" style={{ fontSize: '1.25rem' }}>
                        {
                            PAYMENT_METHODS[orderValues.payment_method as keyof typeof PAYMENT_METHODS]
                            || orderValues.payment_method
                        }
                    </div>
                    <div className="metric-trend neutral">
                        <StatusBadge className={orderValues.payment_received ? 'paid' : 'pending'}>
                            <FontAwesomeIcon icon={orderValues.payment_received ? faCheckCircle : faHourglassHalf} />
                            {orderValues.payment_received ? 'Pago' : 'Pendente'}
                        </StatusBadge>
                    </div>
                </MetricCard>
            </MetricsGrid>

            <InfoSection className="flex-grid">
                <InfoSectionDetail>
                    <h2>
                        <FontAwesomeIcon icon={faUser} />
                        Informações do Cliente
                    </h2>
                    <div className="info-grid">
                        <div className="info-item">
                            <div className="label">Nome Completo</div>
                            <div className="value">
                                {formatTitleCase(clientInfo.first_name)} {formatTitleCase(clientInfo.last_name)}
                            </div>
                        </div>
                        <div className="info-item">
                            <div className="label">Telefone</div>
                            <div className="value">{formatTelephone(clientInfo.phone_number)}</div>
                        </div>
                    </div>
                </InfoSectionDetail>
                    {orderInfo.additional_information && (
                        <InfoSectionDetail>
                            <h2>
                                <FontAwesomeIcon icon={faInfoCircle} />
                                Observações do Pedido
                            </h2>
                            <div className="info-item">
                                <div className="value">{orderInfo.additional_information}</div>
                            </div>
                        </InfoSectionDetail>
                    )}
                <InfoSectionDetail>
                    {clientInfo.address && (
                        <>
                            <h2>
                                <FontAwesomeIcon icon={faMapMarkerAlt} />
                                Endereço de Entrega
                            </h2>
                            <div className="address-block">
                                <div className="address-line">
                                    {clientInfo.address.street}, {clientInfo.address.street_number}
                                    {clientInfo.address.complement && ` - ${clientInfo.address.complement}`}
                                </div>
                                <div className="address-line">
                                    {clientInfo.address.neighborhood} - {clientInfo.address.city}/{clientInfo.address.state}
                                </div>
                                <div className="address-line">
                                    CEP: {clientInfo.address.postal_code}
                                </div>
                                {clientInfo.address.reference_point && (
                                    <div className="address-line" style={{ marginTop: '0.5rem', fontStyle: 'italic', color: '#6b7280' }}>
                                        Referência: {clientInfo.address.reference_point}
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </InfoSectionDetail>
                {deliveryManInfo && (
                    <InfoSectionDetail>
                        <h2>
                            <FontAwesomeIcon icon={faTruck} />
                            Informações do Entregador
                        </h2>
                        <div className="info-grid">
                            <div className="info-item">
                                <div className="label">Nome</div>
                                <div className="value">{formatTitleCase(deliveryManInfo.name)}</div>
                            </div>
                            <div className="info-item">
                                <div className="label">Telefone</div>
                                <div className="value">{deliveryManInfo.phone_number}</div>
                            </div>
                        </div>
                    </InfoSectionDetail>
                )}
            </InfoSection>

            
            {cardDetails && cardDetails.card_message && (
                <InfoSection>
                    <h2>
                        <FontAwesomeIcon icon={faEnvelope} />
                        Mensagem do Cartão
                    </h2>
                    <div className="card-message-block">
                        <div className="card-header">Mensagem:</div>
                        <div className="card-message">"{cardDetails.card_message}"</div>
                        <div className="card-signature">
                            <div>De: <span>{cardDetails.card_from}</span></div>
                            <div>Para: <span>{cardDetails.card_to}</span></div>
                        </div>
                    </div>
                    <PrintCardButton onClick={() => setIsCardModalOpen(true)}>
                        <FontAwesomeIcon icon={faEnvelope} />
                        Imprimir Cartão
                    </PrintCardButton>

                    <PrintCardMessage
                        card_message={cardDetails.card_message}
                        card_from={cardDetails.card_from}
                        card_to={cardDetails.card_to}
                        order_code={orderInfo.code.toString()}
                        isOpen={isCardModalOpen}
                        onRequestClose={() => setIsCardModalOpen(false)}
                    />
                </InfoSection>
            )}

            {orderForEdit && (
                <EditOrderModal
                    isOpen={isEditModalOpen}
                    onRequestClose={() => {
                        setIsEditModalOpen(false);
                        if (id) {
                            const fetchOrderData = async () => {
                                try {
                                    const response = await getOrderById(id as string);
                                    setOrderData(response.data);
                                    
                                    // Reconstrói o objeto fullOrder
                                    const fullOrder = {
                                        id: id,
                                        code: response.data.orderInfo.code,
                                        description: response.data.orderInfo.description,
                                        additional_information: response.data.orderInfo.additional_information,
                                        delivery_date: response.data.orderInfo.delivery_date,
                                        is_delivery: response.data.orderInfo.is_delivery,
                                        online_order: response.data.orderInfo.online_order,
                                        store_front_order: response.data.orderInfo.store_front_order,
                                        status: response.data.orderInfo.status,
                                        client_id: response.data.clientInfo.id,
                                        client: {
                                            id: response.data.clientInfo.id,
                                            first_name: response.data.clientInfo.first_name,
                                            last_name: response.data.clientInfo.last_name,
                                            phone_number: response.data.clientInfo.phone_number,
                                        },
                                        clientAddress: response.data.clientInfo.address || {},
                                        client_address_id: response.data.clientInfo.address?.id,
                                        receiver_name: response.data.orderInfo.receiver_name,
                                        receiver_phone: response.data.orderInfo.receiver_phone,
                                        products_value: response.data.orderValues.products_value,
                                        discount: response.data.orderValues.discount,
                                        delivery_fee: response.data.orderValues.delivery_fee,
                                        total: response.data.orderValues.total,
                                        payment_method: response.data.orderValues.payment_method,
                                        payment_received: response.data.orderValues.payment_received,
                                        has_card: response.data.cardDetails ? true : false,
                                        card_message: response.data.cardDetails?.card_message,
                                        card_from: response.data.cardDetails?.card_from,
                                        card_to: response.data.cardDetails?.card_to,
                                        pickup_on_store: !response.data.orderInfo.is_delivery,
                                        orderItems: response.data.orderItems || []
                                    };
                                    
                                    setOrderForEdit(fullOrder);
                                } catch (error) {
                                    console.error("Error fetching order data:", error);
                                }
                            };
                            fetchOrderData();
                        }
                    }}
                    order={orderForEdit}
                />
            )}
        </Container>
    );
}
