import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useParams, useNavigate } from "react-router-dom";
import moment from 'moment';
import 'moment/locale/pt-br';
import { Line } from 'react-chartjs-2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faArrowLeft,
    faShoppingBag,
    faDollarSign,
    faCalendarAlt,
    faChartLine,
    faHistory,
    faMapMarkerAlt,
    faPhone,
    faInbox,
    faReceipt
} from "@fortawesome/free-solid-svg-icons";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';
import { getClientDetails } from "../../services/clientService";
import { convertMoney } from "../../utils";
import { Loader } from "../../components/Loader";
import { STATUS_LABEL, PAYMENT_METHODS } from "../../constants";
import {
    Container,
    Header,
    MetricsGrid,
    MetricCard,
    ChartSection,
    TableSection,
    AddressesSection,
    EmptyState
} from "./style";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

moment.locale('pt-br');

interface IClientData {
    clientInfo: {
        id: string;
        name: string;
        first_name: string;
        last_name: string;
        phone_number: string;
        created_at: string;
    };
    orders: Array<{
        id: string;
        code: number;
        date: string;
        created_at: string;
        description: string;
        total: number;
        status: string;
        payment_method: string;
        payment_received: boolean;
        pickup_on_store: boolean;
        online_order: boolean;
        store_front_order: boolean;
    }>;
    spendingHistory: Array<{
        month: string;
        amount: number;
    }>;
    addresses: Array<{
        id: string;
        street: string;
        street_number: string;
        complement: string | null;
        neighborhood: string;
        reference_point: string;
        city: string;
        state: string;
        postal_code: string;
        country: string;
        created_at: string;
    }>;
    statistics: {
        totalOrders: number;
        totalSpent: number;
        averageTicket: number;
        lastOrderValue: number;
        lastOrderDate: string;
    };
}

export function ClientDetail() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [clientData, setClientData] = useState<IClientData | null>(null);

    useEffect(() => {
        const fetchClientData = async () => {
            try {
                setLoading(true);
                const response = await getClientDetails(id as string);
                setClientData(response.data);
            } catch (error) {
                console.error("Error fetching client data:", error);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchClientData();
        }
    }, [id]);

    if (loading) {
        return <Loader show />;
    }

    if (!clientData) {
        return (
            <Container>
                <EmptyState>
                    <div className="icon">
                        <FontAwesomeIcon icon={faInbox} />
                    </div>
                    <h3>Cliente não encontrado</h3>
                    <p>Não foi possível carregar as informações deste cliente</p>
                </EmptyState>
            </Container>
        );
    }

    const { clientInfo, orders, spendingHistory, addresses, statistics } = clientData;

    // Get initials for avatar
    const getInitials = () => {
        return `${clientInfo.first_name.charAt(0)}${clientInfo.last_name.charAt(0)}`.toUpperCase();
    };

    // Chart data configuration
    const chartData = {
        labels: spendingHistory.map(item => {
            const [year, month] = item.month.split('-');
            return moment(`${year}-${month}-01`).format('MMM/YY');
        }),
        datasets: [
            {
                label: 'Gastos Mensais',
                data: spendingHistory.map(item => item.amount),
                borderColor: '#ec4899',
                backgroundColor: 'rgba(236, 72, 153, 0.1)',
                tension: 0.4,
                fill: true,
                pointRadius: 4,
                pointHoverRadius: 6,
                pointBackgroundColor: '#ec4899',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
            }
        ]
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false
            },
            tooltip: {
                backgroundColor: '#fff',
                titleColor: '#374151',
                bodyColor: '#6b7280',
                borderColor: '#e5e7eb',
                borderWidth: 1,
                padding: 12,
                displayColors: false,
                callbacks: {
                    label: (context: any) => `Gasto: ${convertMoney(context.parsed.y)}`
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    callback: (value: any) => `R$ ${value.toFixed(2)}`
                },
                grid: {
                    color: '#f3f4f6'
                }
            },
            x: {
                grid: {
                    display: false
                }
            }
        }
    };

    // Get status badge class
    const getStatusClass = (status: string) => {
        if (status === 'Delivered' || status === 'DONE') return 'delivered';
        if (status === 'Cancelled') return 'cancelled';
        return 'in-progress';
    };

    // Get order type badges
    const getOrderTypeBadges = (order: any) => {
        const badges = [];
        if (!order.is_delivery && !order.online_order && !order.store_front_order) {
            badges.push(<span key="store" className="badge pdv">PDV</span>);
        }
        if (order.is_delivery && order.online_order) {
            badges.push(<span key="whatsapp" className="badge whatsapp">Whatsapp</span>);
        }
        if (order.store_front_order) badges.push(<span key="store" className="badge site">Site</span>);
        if (order.is_delivery && !order.online_order && !order.store_front_order) {
            badges.push(<span key="whatsapp" className="badge balcao">Balcão</span>);
        }
        return badges;
    };

    return (
        <Container>
            <Header>
                <button className="back-button" onClick={() => navigate(-1)}>
                    <FontAwesomeIcon icon={faArrowLeft} />
                </button>
                <div className="client-info">
                    <div className="avatar">
                        {getInitials()}
                    </div>
                    <div>
                        <h1>{clientInfo.name}</h1>
                        <p className="phone">
                            <FontAwesomeIcon icon={faPhone} />
                            {clientInfo.phone_number}
                        </p>
                        <p className="member-since">
                            Cliente desde {moment(clientInfo.created_at).format('MMMM [de] YYYY')}
                        </p>
                    </div>
                </div>
            </Header>

            <MetricsGrid>
                <MetricCard color="#ec4899">
                    <div className="metric-header">
                        <div className="icon">
                            <FontAwesomeIcon icon={faShoppingBag} />
                        </div>
                        <div className="metric-label">Total de Pedidos</div>
                    </div>
                    <div className="metric-value">{statistics.totalOrders}</div>
                    <div className="metric-trend neutral">
                        {statistics.totalOrders === 1 ? 'Pedido realizado' : 'Pedidos realizados'}
                    </div>
                </MetricCard>

                <MetricCard color="#10b981">
                    <div className="metric-header">
                        <div className="icon">
                            <FontAwesomeIcon icon={faDollarSign} />
                        </div>
                        <div className="metric-label">Total Gasto</div>
                    </div>
                    <div className="metric-value">{convertMoney(statistics.totalSpent)}</div>
                    <div className="metric-trend neutral">
                        Em todos os pedidos
                    </div>
                </MetricCard>

                <MetricCard color="#8b5cf6">
                    <div className="metric-header">
                        <div className="icon">
                            <FontAwesomeIcon icon={faReceipt} />
                        </div>
                        <div className="metric-label">Ticket Médio</div>
                    </div>
                    <div className="metric-value">{convertMoney(statistics.averageTicket)}</div>
                    <div className="metric-trend neutral">
                        Por pedido
                    </div>
                </MetricCard>

                <MetricCard color="#f59e0b">
                    <div className="metric-header">
                        <div className="icon">
                            <FontAwesomeIcon icon={faCalendarAlt} />
                        </div>
                        <div className="metric-label">Último Pedido</div>
                    </div>
                    <div className="metric-value">{convertMoney(statistics.lastOrderValue)}</div>
                    <div className="metric-trend neutral">
                        {moment(statistics.lastOrderDate).format('DD/MM/YYYY')}
                    </div>
                </MetricCard>
            </MetricsGrid>

            {spendingHistory.length > 0 && (
                <ChartSection>
                    <h2>
                        <FontAwesomeIcon icon={faChartLine} />
                        Histórico de Gastos
                    </h2>
                    <p className="subtitle">Evolução dos gastos do cliente nos últimos 12 meses</p>
                    <div style={{ height: '300px' }}>
                        <Line data={chartData} options={chartOptions} />
                    </div>
                </ChartSection>
            )}

            <TableSection>
                <h2>
                    <FontAwesomeIcon icon={faHistory} />
                    Histórico de Pedidos
                </h2>
                <p className="subtitle">Todos os pedidos realizados por este cliente</p>

                {orders.length > 0 ? (
                    <table>
                        <thead>
                            <tr>
                                <th>Pedido</th>
                                <th>Data</th>
                                <th className="description">Descrição</th>
                                <th>Tipo</th>
                                <th>Forma de Pagamento</th>
                                <th>Status</th>
                                <th>Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map(order => (
                                <tr key={order.id}>
                                    <td>
                                        <Link to={`/backoffice/pedido/${order.id}`} className="order-code-link">
                                            #{order.code}
                                        </Link>
                                    </td>
                                    <td data-label="Data">{moment(order.date).format('DD/MM/YYYY')}</td>
                                    <td data-label="Descrição" className="description">{order.description}</td>
                                    <td data-label="Tipo">
                                        <div className="order-type">
                                            {getOrderTypeBadges(order)}
                                        </div>
                                    </td>
                                    <td data-label="Pagamento">{PAYMENT_METHODS[order.payment_method as keyof typeof PAYMENT_METHODS] || order.payment_method}</td>
                                    <td data-label="Status">
                                        <span className={`status-badge ${getStatusClass(order.status)}`}>
                                            {STATUS_LABEL[order.status as keyof typeof STATUS_LABEL] || order.status}
                                        </span>
                                    </td>
                                    <td className="total-price" data-label="Total">{convertMoney(order.total)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <EmptyState>
                        <div className="icon">
                            <FontAwesomeIcon icon={faInbox} />
                        </div>
                        <h3>Nenhum pedido encontrado</h3>
                        <p>Este cliente ainda não realizou nenhum pedido</p>
                    </EmptyState>
                )}
            </TableSection>

            <AddressesSection>
                <h2>
                    <FontAwesomeIcon icon={faMapMarkerAlt} />
                    Endereços Cadastrados
                </h2>
                <p className="subtitle">Endereços de entrega do cliente</p>

                {addresses.length > 0 ? (
                    <div className="addresses-grid">
                        {addresses.map(address => (
                            <div key={address.id} className="address-card">
                                <div className="address-header">
                                    <FontAwesomeIcon icon={faMapMarkerAlt} />
                                    <span>{address.neighborhood}</span>
                                </div>
                                <div className="address-content">
                                    <p><strong>{address.street}, {address.street_number}</strong></p>
                                    {address.complement && <p>{address.complement}</p>}
                                    <p>{address.neighborhood} - {address.city}/{address.state}</p>
                                    <p>CEP: {address.postal_code}</p>
                                    {address.reference_point && (
                                        <p className="reference">
                                            <FontAwesomeIcon icon={faMapMarkerAlt} style={{ fontSize: '0.8rem' }} />
                                            {' '}{address.reference_point}
                                        </p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <EmptyState>
                        <div className="icon">
                            <FontAwesomeIcon icon={faInbox} />
                        </div>
                        <h3>Nenhum endereço cadastrado</h3>
                        <p>Este cliente ainda não possui endereços cadastrados</p>
                    </EmptyState>
                )}
            </AddressesSection>
        </Container>
    );
}
