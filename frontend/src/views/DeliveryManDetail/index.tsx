import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import moment from 'moment';
import 'moment/locale/pt-br';
import { Line } from 'react-chartjs-2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faArrowLeft,
    faTruck,
    faDollarSign,
    faChartLine,
    faHistory,
    faPhone,
    faInbox,
    faCheckCircle,
    faHourglassHalf
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
import { getDeliveryManDetails } from "../../services/deliveryManService";
import { convertMoney } from "../../utils";
import { Loader } from "../../components/Loader";
import { DateRangePicker } from "../../components/DateRangePicker";
import { Pagination } from "../../components/Pagination";
import {
    Container,
    Header,
    MetricsGrid,
    MetricCard,
    ChartSection,
    TableSection,
    TableHeader,
    TableTitle,
    TableFilters,
    TableContent,
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

interface IDeliveryManData {
    deliveryMan: {
        name: string;
        phone_number: string;
    };
    deliveries: Array<{
        id: string;
        order_id: string;
        order_code: number;
        delivery_date: string;
        delivery_fee: number;
        is_paid: boolean;
    }>;
    pagination: {
        total: number;
        currentPage: number;
    };
    deliveryHistory: Array<{
        date: string;
        count: number;
        total: number;
    }>;
    summary: {
        total_deliveries: number;
        total_paid: number;
        pending_payment: number;
    };
}

export function DeliveryManDetail() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [deliveryManData, setDeliveryManData] = useState<IDeliveryManData | null>(null);
    const [page, setPage] = useState(1);
    const [startDate, setStartDate] = useState<string | null>(null);
    const [endDate, setEndDate] = useState<string | null>(null);
    const pageSize = 25;

    useEffect(() => {
        const fetchDeliveryManData = async () => {
            try {
                setLoading(true);
                const response = await getDeliveryManDetails(id as string, page, pageSize, startDate, endDate);
                setDeliveryManData(response.data);
            } catch (error) {
                console.error("Error fetching delivery man data:", error);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchDeliveryManData();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id, page, startDate, endDate]);

    const handleDateRangeChange = (start: string | null, end: string | null, filterType: string) => {
        setStartDate(start);
        setEndDate(end);
        setPage(1);
    };

    if (loading) {
        return <Loader show />;
    }

    if (!deliveryManData) {
        return (
            <Container>
                <EmptyState>
                    <div className="icon">
                        <FontAwesomeIcon icon={faInbox} />
                    </div>
                    <h3>Motoboy não encontrado</h3>
                    <p>Não foi possível carregar as informações deste motoboy</p>
                </EmptyState>
            </Container>
        );
    }

    const { deliveryMan, deliveries, deliveryHistory, summary, pagination } = deliveryManData;
    const { total } = pagination;

    // Get initials for avatar
    const getInitials = () => {
        const nameParts = deliveryMan.name.split(' ');
        if (nameParts.length >= 2) {
            return `${nameParts[0].charAt(0)}${nameParts[nameParts.length - 1].charAt(0)}`.toUpperCase();
        }
        return deliveryMan.name.substring(0, 2).toUpperCase();
    };

    // Chart data configuration
    const chartData = {
        labels: deliveryHistory.map(item => moment(item.date).format('DD/MM')),
        datasets: [
            {
                label: 'Total em Entregas',
                data: deliveryHistory.map(item => item.total),
                borderColor: '#3b82f6',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                tension: 0.4,
                fill: true,
                pointRadius: 4,
                pointHoverRadius: 6,
                pointBackgroundColor: '#3b82f6',
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
                    label: (context: any) => `Total: ${convertMoney(context.parsed.y)}`,
                    afterLabel: (context: any) => {
                        const dataPoint = deliveryHistory[context.dataIndex];
                        return `Entregas: ${dataPoint.count}`;
                    }
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

    return (
        <Container>
            <Header>
                <button className="back-button" onClick={() => navigate(-1)}>
                    <FontAwesomeIcon icon={faArrowLeft} />
                </button>
                <div className="client-info">
                    <div className="info-left">
                        <div className="avatar delivery">
                            {getInitials()}
                        </div>
                        <div>
                            <h1>{deliveryMan.name}</h1>
                            <p className="phone">
                                <FontAwesomeIcon icon={faPhone} />
                                {deliveryMan.phone_number}
                            </p>
                            <p className="member-since">
                                Motoboy Parceiro
                            </p>
                        </div>
                    </div>
                    <div className="info-right">
                        <DateRangePicker onDateRangeChange={handleDateRangeChange}/>
                    </div>
                </div>
            </Header>

            <MetricsGrid>
                <MetricCard color="#3b82f6">
                    <div className="metric-header">
                        <div className="icon">
                            <FontAwesomeIcon icon={faTruck} />
                        </div>
                        <div className="metric-label">Total de Entregas</div>
                    </div>
                    <div className="metric-value">{summary.total_deliveries}</div>
                    <div className="metric-trend neutral">
                        {summary.total_deliveries === 1 ? 'Entrega realizada' : 'Entregas realizadas'}
                    </div>
                </MetricCard>

                <MetricCard color="#10b981">
                    <div className="metric-header">
                        <div className="icon">
                            <FontAwesomeIcon icon={faCheckCircle} />
                        </div>
                        <div className="metric-label">Total Pago</div>
                    </div>
                    <div className="metric-value">{convertMoney(summary.total_paid)}</div>
                    <div className="metric-trend neutral">
                        Entregas quitadas
                    </div>
                </MetricCard>

                <MetricCard color="#f59e0b">
                    <div className="metric-header">
                        <div className="icon">
                            <FontAwesomeIcon icon={faHourglassHalf} />
                        </div>
                        <div className="metric-label">Pendente</div>
                    </div>
                    <div className="metric-value">{convertMoney(summary.pending_payment)}</div>
                    <div className="metric-trend neutral">
                        A receber
                    </div>
                </MetricCard>

                <MetricCard color="#8b5cf6">
                    <div className="metric-header">
                        <div className="icon">
                            <FontAwesomeIcon icon={faDollarSign} />
                        </div>
                        <div className="metric-label">Total Geral</div>
                    </div>
                    <div className="metric-value">{convertMoney(summary.total_paid + summary.pending_payment)}</div>
                    <div className="metric-trend neutral">
                        Todas as entregas
                    </div>
                </MetricCard>
            </MetricsGrid>

            {deliveryHistory.length > 0 && (
                <ChartSection>
                    <h2>
                        <FontAwesomeIcon icon={faChartLine} />
                        Histórico de Entregas
                    </h2>
                    <p className="subtitle">Evolução das entregas e ganhos ao longo do tempo</p>
                    <div style={{ height: '300px' }}>
                        <Line data={chartData} options={chartOptions} />
                    </div>
                </ChartSection>
            )}

            <TableSection>
                <TableHeader>
                    <TableTitle>
                        <h2>
                            <FontAwesomeIcon icon={faHistory} />
                            Todas as Entregas
                        </h2>
                        <p className="subtitle">Histórico completo de entregas realizadas</p>
                    </TableTitle>
                    <TableFilters>
                        <Pagination
                            currentPage={page}
                            total={total}
                            pageSize={pageSize}
                            onPageChange={setPage}
                        />
                    </TableFilters>
                </TableHeader>

                <TableContent>
                    {deliveries.length > 0 ? (
                        <table className="responsive-table">
                        <thead>
                            <tr>
                                <th>Pedido</th>
                                <th>Data da Entrega</th>
                                <th>Taxa de Entrega</th>
                                <th>Status Pagamento</th>
                            </tr>
                        </thead>
                        <tbody>
                            {deliveries.map(delivery => (
                                <tr key={delivery.id}>
                                    <td className="order-code" data-label="Pedido">
                                        <Link to={`/backoffice/pedido/${delivery.order_id}`} className="order-code-link">
                                            #{delivery.order_code}
                                        </Link>
                                    </td>
                                    
                                    <td data-label="Data">{moment(delivery.delivery_date).format('DD/MM/YYYY')}</td>
                                    <td className="delivery-fee" data-label="Taxa">{convertMoney(delivery.delivery_fee)}</td>
                                    <td data-label="Pagamento">
                                        <span className={`status-badge ${delivery.is_paid ? 'paid' : 'pending'}`}>
                                            {delivery.is_paid ? 'Pago' : 'Pendente'}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <EmptyState>
                        <div className="icon">
                            <FontAwesomeIcon icon={faInbox} />
                        </div>
                        <h3>Nenhuma entrega encontrada</h3>
                        <p>Este motoboy ainda não realizou nenhuma entrega</p>
                    </EmptyState>
                )}
                </TableContent>
            </TableSection>
        </Container>
    );
}
