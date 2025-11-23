import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import moment from 'moment';
import { Line } from 'react-chartjs-2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faArrowLeft,
    faBoxes,
    faWarehouse,
    faDollarSign,
    faCalendarAlt,
    faChartLine,
    faHistory,
    faArrowUp,
    faArrowDown,
    faMinus,
    faInbox
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
import { getProductStockTransactions } from "../../services/stockTransactionService";
import { convertMoney } from "../../utils";
import { Loader } from "../../components/Loader";
import {
    Container,
    Header,
    MetricsGrid,
    MetricCard,
    ChartSection,
    TableSection,
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

interface IProductStockData {
    product_info: {
        id: string;
        name: string;
        image: string;
        price: number;
    };
    transactions: Array<{
        id: string;
        purchased_date: string;
        supplier: string;
        unity: string;
        quantity: number;
        unity_price: number;
        total_price: number;
    }>;
    price_history: Array<{
        date: string;
        unity_price: number;
    }>;
    metrics: {
        total_quantity_purchased: number;
        current_stock: number;
        average_price: number;
        last_purchase_date: string;
    };
}

export function ProductStockDetail() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [stockData, setStockData] = useState<IProductStockData | null>(null);

    useEffect(() => {
        const fetchStockData = async () => {
            try {
                setLoading(true);
                const response = await getProductStockTransactions(id as string);
                setStockData(response.data);
            } catch (error) {
                console.error("Error fetching stock data:", error);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchStockData();
        }
    }, [id]);

    if (loading) {
        return <Loader show />;
    }

    if (!stockData) {
        return (
            <Container>
                <EmptyState>
                    <div className="icon">
                        <FontAwesomeIcon icon={faInbox} />
                    </div>
                    <h3>Produto não encontrado</h3>
                    <p>Não foi possível carregar as informações deste produto</p>
                </EmptyState>
            </Container>
        );
    }

    const { product_info, transactions, price_history, metrics } = stockData;

    // Calculate price trend
    const getPriceTrend = () => {
        if (price_history.length < 2) return { trend: 'neutral', percentage: 0 };

        const lastPrice = price_history[price_history.length - 1].unity_price;
        const previousPrice = price_history[price_history.length - 2].unity_price;
        const difference = lastPrice - previousPrice;
        const percentage = ((difference / previousPrice) * 100).toFixed(1);

        if (difference > 0) return { trend: 'negative', percentage: `+${percentage}` };
        if (difference < 0) return { trend: 'positive', percentage };
        return { trend: 'neutral', percentage: '0.0' };
    };

    const priceTrend = getPriceTrend();

    // Chart data configuration
    const chartData = {
        labels: price_history.map(item => moment(item.date).format('MMM')),
        datasets: [
            {
                label: 'Preço por Unidade',
                data: price_history.map(item => item.unity_price),
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
                    label: (context: any) => `Preço: ${convertMoney(context.parsed.y)}`
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

    // Calculate total invested
    const totalInvested = transactions.reduce((sum, transaction) => sum + transaction.total_price, 0);

    return (
        <Container>
            <Header>
                <button className="back-button" onClick={() => navigate('/backoffice/estoque')}>
                    <FontAwesomeIcon icon={faArrowLeft} />
                </button>
                <div className="product-info">
                    {product_info.image && (
                        <img src={product_info.image} alt={product_info.name} />
                    )}
                    <div>
                        <h1>{product_info.name}</h1>
                        <span className="current-price">{convertMoney(product_info?.price)}</span>
                        <p>Detalhes e histórico do produto</p>
                    </div>
                </div>
            </Header>

            <MetricsGrid>
                <MetricCard color="#ec4899">
                    <div className="metric-header">
                        <div className="icon">
                            <FontAwesomeIcon icon={faBoxes} />
                        </div>
                        <div className="metric-label">Estoque Atual</div>
                    </div>
                    <div className="metric-value">{metrics.current_stock} {transactions[0]?.unity || 'UN'}</div>
                    <div className="metric-trend neutral">
                        Em {transactions.length} compras registradas
                    </div>
                </MetricCard>

                <MetricCard color="#8b5cf6">
                    <div className="metric-header">
                        <div className="icon">
                            <FontAwesomeIcon icon={faWarehouse} />
                        </div>
                        <div className="metric-label">Total Comprado</div>
                    </div>
                    <div className="metric-value">{metrics.total_quantity_purchased} {transactions[0]?.unity || 'UN'}</div>
                    <div className="metric-trend neutral">
                        Histórico completo
                    </div>
                </MetricCard>

                <MetricCard color="#10b981">
                    <div className="metric-header">
                        <div className="icon">
                            <FontAwesomeIcon icon={faDollarSign} />
                        </div>
                        <div className="metric-label">Preço Médio</div>
                    </div>
                    <div className="metric-value">{convertMoney(metrics.average_price)}</div>
                    <div className={`metric-trend ${priceTrend.trend}`}>
                        <FontAwesomeIcon icon={
                            priceTrend.trend === 'positive' ? faArrowDown :
                            priceTrend.trend === 'negative' ? faArrowUp : faMinus
                        } />
                        {priceTrend.percentage}% {priceTrend.trend === 'positive' ? 'menor' : priceTrend.trend === 'negative' ? 'maior' : ''} que a média
                    </div>
                </MetricCard>

                <MetricCard color="#f59e0b">
                    <div className="metric-header">
                        <div className="icon">
                            <FontAwesomeIcon icon={faCalendarAlt} />
                        </div>
                        <div className="metric-label">Última Compra</div>
                    </div>
                    <div className="metric-value">
                        {convertMoney(transactions[0]?.unity_price || 0)}
                    </div>
                    <div className="metric-trend neutral">
                        {moment(metrics.last_purchase_date).format('DD/MM/YYYY')}
                    </div>
                </MetricCard>
            </MetricsGrid>

            {price_history.length > 0 && (
                <ChartSection>
                    <h2>
                        <FontAwesomeIcon icon={faChartLine} />
                        Variação de Preço
                    </h2>
                    <p className="subtitle">Histórico de preços de compra nos últimos 12 meses</p>
                    <div style={{ height: '300px' }}>
                        <Line data={chartData} options={chartOptions} />
                    </div>
                </ChartSection>
            )}

            <TableSection>
                <h2>
                    <FontAwesomeIcon icon={faHistory} />
                    Histórico de Compras
                </h2>
                <p className="subtitle">Todas as compras registradas deste produto</p>

                {transactions.length > 0 ? (
                    <table>
                        <thead>
                            <tr>
                                <th>Data</th>
                                <th>Fornecedor</th>
                                <th>Quantidade</th>
                                <th>Preço Unit.</th>
                                <th>Preço Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transactions.map(transaction => (
                                <tr key={transaction.id}>
                                    <td>{moment(transaction.purchased_date).format('DD/MM/YYYY')}</td>
                                    <td className="supplier">{transaction.supplier}</td>
                                    <td>{transaction.quantity} {transaction.unity}</td>
                                    <td>{convertMoney(transaction.unity_price)}</td>
                                    <td className="total-price">{convertMoney(transaction.total_price)}</td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot>
                            <tr>
                                <td colSpan={4}>Total Investido</td>
                                <td className="total-price">{convertMoney(totalInvested)}</td>
                            </tr>
                        </tfoot>
                    </table>
                ) : (
                    <EmptyState>
                        <div className="icon">
                            <FontAwesomeIcon icon={faInbox} />
                        </div>
                        <h3>Nenhuma compra registrada</h3>
                        <p>Ainda não há histórico de compras para este produto</p>
                    </EmptyState>
                )}
            </TableSection>
        </Container>
    );
}
