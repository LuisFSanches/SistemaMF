import { useState, useEffect, useRef } from "react";
import moment from 'moment';
import 'moment/locale/pt-br';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faChartLine,
    faDollarSign,
    faShoppingCart,
    faBoxOpen,
    faUsers,
    faWarehouse,
    faTruck,
    faIndustry,
    faChartBar,
    faTrophy,
    faInbox,
    faFileExport
} from "@fortawesome/free-solid-svg-icons";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';
import {
    getSalesReport,
    getTopProducts,
    getTopClients,
    getStockReport,
    getFinancialReport,
    getDeliveryReport,
    getSupplierReport,
    ISalesReport,
    ITopProduct,
    ITopClient,
    IStockReport,
    IFinancialReport,
    IDeliveryReport,
    ISupplierReport
} from "../../services/reportService";
import { convertMoney } from "../../utils";
import { DateRangePicker } from "../../components/DateRangePicker";
import { PAYMENT_METHODS, STATUS_LABEL } from "../../constants";
import {
    Container,
    Header,
    ExportButton,
    TabsContainer,
    TabsList,
    Tab,
    TabContent,
    MetricsGrid,
    MetricCard,
    ChartSection,
    TableSection,
    TableHeader,
    TableTitle,
    TableContent,
    EmptyState,
    LoadingContainer,
    RankBadge
} from "./style";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

moment.locale('pt-br');

type TabType = 'sales' | 'products' | 'clients' | 'stock' | 'financial' | 'delivery' | 'supplier';

export function Reports() {
    const [activeTab, setActiveTab] = useState<TabType>('sales');
    const [loading, setLoading] = useState(true);
    const [startDate, setStartDate] = useState<string | null>(null);
    const [endDate, setEndDate] = useState<string | null>(null);
    const reportRef = useRef<HTMLDivElement>(null);

    // Data states
    const [salesData, setSalesData] = useState<ISalesReport | null>(null);
    const [topProducts, setTopProducts] = useState<ITopProduct[]>([]);
    const [topClients, setTopClients] = useState<ITopClient[]>([]);
    const [stockData, setStockData] = useState<IStockReport[]>([]);
    const [financialData, setFinancialData] = useState<IFinancialReport | null>(null);
    const [deliveryData, setDeliveryData] = useState<IDeliveryReport | null>(null);
    const [supplierData, setSupplierData] = useState<ISupplierReport[]>([]);

    useEffect(() => {
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeTab, startDate, endDate]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const filters = { start_date: startDate || undefined, end_date: endDate || undefined };

            switch (activeTab) {
                case 'sales':
                    const sales = await getSalesReport(filters);
                    setSalesData(sales.data);
                    break;
                case 'products':
                    const products = await getTopProducts(filters);
                    setTopProducts(products.data);
                    break;
                case 'clients':
                    const clients = await getTopClients(filters);
                    setTopClients(clients.data);
                    break;
                case 'stock':
                    const stock = await getStockReport();
                    setStockData(stock.data);
                    break;
                case 'financial':
                    const financial = await getFinancialReport(filters);
                    setFinancialData(financial.data);
                    break;
                case 'delivery':
                    const delivery = await getDeliveryReport(filters);
                    setDeliveryData(delivery.data);
                    break;
                case 'supplier':
                    const supplier = await getSupplierReport(filters);
                    setSupplierData(supplier.data);
                    break;
            }
        } catch (error) {
            console.error("Error fetching report data:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDateRangeChange = (start: string | null, end: string | null, filterType: string) => {
        setStartDate(start);
        setEndDate(end);
    };

    const getTabTitle = (tab: TabType): string => {
        const titles: Record<TabType, string> = {
            sales: 'Relatório de Vendas',
            products: 'Produtos Mais Vendidos',
            clients: 'Clientes VIP',
            stock: 'Relatório de Estoque',
            financial: 'Relatório Financeiro',
            delivery: 'Relatório de Entregas',
            supplier: 'Relatório de Fornecedores'
        };
        return titles[tab];
    };

    const handleExportPDF = async () => {
        try {
            if (!reportRef.current) return;
            
            const { jsPDF } = await import('jspdf');
            const html2canvas = (await import('html2canvas')).default;

            const pdf = new jsPDF('p', 'mm', 'a4');
            const pageWidth = pdf.internal.pageSize.getWidth();
            const pageHeight = pdf.internal.pageSize.getHeight();

            // Header
            pdf.setFontSize(20);
            pdf.setTextColor(59, 130, 246);
            pdf.text('Relatório - Sistema MF', pageWidth / 2, 15, { align: 'center' });

            pdf.setFontSize(12);
            pdf.setTextColor(107, 114, 128);
            pdf.text(`${getTabTitle(activeTab)}`, pageWidth / 2, 22, { align: 'center' });
            
            if (startDate && endDate) {
                pdf.text(
                    `Período: ${moment(startDate).format('DD/MM/YYYY')} - ${moment(endDate).format('DD/MM/YYYY')}`,
                    pageWidth / 2,
                    29,
                    { align: 'center' }
                );
            } else {
                pdf.text('Período: Todos os registros', pageWidth / 2, 29, { align: 'center' });
            }

            // Content
            const canvas = await html2canvas(reportRef.current, {
                scale: 2,
                useCORS: true,
                logging: false,
                backgroundColor: '#ffffff'
            });

            const imgData = canvas.toDataURL('image/png');
            const imgWidth = pageWidth - 20;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
            
            let heightLeft = imgHeight;
            let position = 35;

            pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
            heightLeft -= (pageHeight - position);

            while (heightLeft > 0) {
                position = heightLeft - imgHeight + 35;
                pdf.addPage();
                pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
                heightLeft -= pageHeight;
            }

            // Footer
            const totalPages = pdf.getNumberOfPages();
            for (let i = 1; i <= totalPages; i++) {
                pdf.setPage(i);
                pdf.setFontSize(9);
                pdf.setTextColor(156, 163, 175);
                pdf.text(
                    `Página ${i} de ${totalPages} - Gerado em ${moment().format('DD/MM/YYYY HH:mm')}`,
                    pageWidth / 2,
                    pageHeight - 10,
                    { align: 'center' }
                );
            }

            pdf.save(`relatorio-${activeTab}-${moment().format('YYYY-MM-DD')}.pdf`);
        } catch (error) {
            console.error('Error exporting PDF:', error);
            alert('Erro ao exportar PDF. Tente novamente.');
        }
    };

    const renderSalesReport = () => {
        if (!salesData) return null;

        const dailySalesChart = {
            labels: salesData.daily_sales.map(item => moment(item.date).format('DD/MM')),
            datasets: [
                {
                    label: 'Vendas Diárias',
                    data: salesData.daily_sales.map(item => item.total_value),
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

        const statusChart = {
            labels: salesData.orders_by_status.map(item => (STATUS_LABEL as any)[item.status] || item.status),
            datasets: [
                {
                    data: salesData.orders_by_status.map(item => item.total_value),
                    backgroundColor: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'],
                    borderWidth: 0
                }
            ]
        };

        const paymentMethodChart = {
            labels: salesData.orders_by_payment_method.map(item => (PAYMENT_METHODS as any)[item.payment_method] || item.payment_method),
            datasets: [
                {
                    label: 'Valor',
                    data: salesData.orders_by_payment_method.map(item => item.total_value),
                    backgroundColor: '#3b82f6',
                    borderRadius: 8
                }
            ]
        };

        return (
            <div ref={reportRef}>
                <MetricsGrid>
                    <MetricCard color="#3b82f6">
                        <div className="metric-header">
                            <div className="icon">
                                <FontAwesomeIcon icon={faShoppingCart} />
                            </div>
                            <div className="metric-label">Total de Pedidos</div>
                        </div>
                        <div className="metric-value">{salesData.total_orders}</div>
                        <div className="metric-trend neutral">Pedidos realizados</div>
                    </MetricCard>

                    <MetricCard color="#10b981">
                        <div className="metric-header">
                            <div className="icon">
                                <FontAwesomeIcon icon={faDollarSign} />
                            </div>
                            <div className="metric-label">Receita Total</div>
                        </div>
                        <div className="metric-value">{convertMoney(salesData.total_revenue)}</div>
                        <div className="metric-trend neutral">Faturamento bruto</div>
                    </MetricCard>

                    <MetricCard color="#8b5cf6">
                        <div className="metric-header">
                            <div className="icon">
                                <FontAwesomeIcon icon={faChartLine} />
                            </div>
                            <div className="metric-label">Ticket Médio</div>
                        </div>
                        <div className="metric-value">{convertMoney(salesData.average_ticket)}</div>
                        <div className="metric-trend neutral">Valor médio por pedido</div>
                    </MetricCard>

                    <MetricCard color="#f59e0b">
                        <div className="metric-header">
                            <div className="icon">
                                <FontAwesomeIcon icon={faBoxOpen} />
                            </div>
                            <div className="metric-label">Produtos Vendidos</div>
                        </div>
                        <div className="metric-value">{salesData.total_products_sold}</div>
                        <div className="metric-trend neutral">Unidades totais</div>
                    </MetricCard>
                </MetricsGrid>

                {salesData.daily_sales.length > 0 && (
                    <ChartSection>
                        <h2>
                            <FontAwesomeIcon icon={faChartLine} />
                            Evolução de Vendas
                        </h2>
                        <p className="subtitle">Vendas diárias no período selecionado</p>
                        <div style={{ height: '300px' }}>
                            <Line data={dailySalesChart} options={{
                                responsive: true,
                                maintainAspectRatio: false,
                                plugins: {
                                    legend: { display: false },
                                    tooltip: {
                                        backgroundColor: '#fff',
                                        titleColor: '#374151',
                                        bodyColor: '#6b7280',
                                        borderColor: '#e5e7eb',
                                        borderWidth: 1,
                                        padding: 12,
                                        displayColors: false,
                                        callbacks: {
                                            label: (context: any) => `Vendas: ${convertMoney(context.parsed.y)}`
                                        }
                                    }
                                },
                                scales: {
                                    y: {
                                        beginAtZero: true,
                                        ticks: {
                                            callback: (value: any) => `R$ ${value.toFixed(2)}`
                                        },
                                        grid: { color: '#f3f4f6' }
                                    },
                                    x: { grid: { display: false } }
                                }
                            }} />
                        </div>
                    </ChartSection>
                )}

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                    {salesData.orders_by_status.length > 0 && (
                        <ChartSection>
                            <h2>
                                <FontAwesomeIcon icon={faChartBar} />
                                Pedidos por Status
                            </h2>
                            <p className="subtitle">Distribuição de pedidos</p>
                            <div style={{ height: '250px', display: 'flex', justifyContent: 'center' }}>
                                <Doughnut data={statusChart} options={{
                                    responsive: true,
                                    maintainAspectRatio: false,
                                    plugins: {
                                        legend: {
                                            position: 'bottom',
                                            labels: { padding: 15, font: { size: 12 } }
                                        },
                                        tooltip: {
                                            callbacks: {
                                                label: (context: any) => {
                                                    const item = salesData.orders_by_status[context.dataIndex];
                                                    return [`Valor: ${convertMoney(item.total_value)}`, `Quantidade: ${item.count}`];
                                                }
                                            }
                                        }
                                    }
                                }} />
                            </div>
                        </ChartSection>
                    )}

                    {salesData.orders_by_payment_method.length > 0 && (
                        <ChartSection>
                            <h2>
                                <FontAwesomeIcon icon={faDollarSign} />
                                Métodos de Pagamento
                            </h2>
                            <p className="subtitle">Vendas por forma de pagamento</p>
                            <div style={{ height: '250px' }}>
                                <Bar data={paymentMethodChart} options={{
                                    responsive: true,
                                    maintainAspectRatio: false,
                                    plugins: {
                                        legend: { display: false },
                                        tooltip: {
                                            callbacks: {
                                                label: (context: any) => `Valor: ${convertMoney(context.parsed.y)}`
                                            }
                                        }
                                    },
                                    scales: {
                                        y: {
                                            beginAtZero: true,
                                            ticks: {
                                                callback: (value: any) => `R$ ${value.toFixed(2)}`
                                            }
                                        }
                                    }
                                }} />
                            </div>
                        </ChartSection>
                    )}
                </div>
            </div>
        );
    };

    const renderTopProducts = () => {
        if (topProducts.length === 0) {
            return (
                <EmptyState>
                    <div className="icon">
                        <FontAwesomeIcon icon={faInbox} />
                    </div>
                    <h3>Nenhum produto encontrado</h3>
                    <p>Não há produtos vendidos no período selecionado</p>
                </EmptyState>
            );
        }

        return (
            <div ref={reportRef}>
                <TableSection>
                    <TableHeader>
                        <TableTitle>
                            <h2>
                                <FontAwesomeIcon icon={faTrophy} />
                                Produtos Mais Vendidos
                            </h2>
                            <p className="subtitle">Ranking de produtos por receita total</p>
                        </TableTitle>
                    </TableHeader>
                    <TableContent>
                        <table className="responsive-table">
                            <thead>
                                <tr>
                                    <th>Ranking</th>
                                    <th>Produto</th>
                                    <th>Quantidade</th>
                                    <th>Pedidos</th>
                                    <th>Preço Médio</th>
                                    <th>Receita Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {topProducts.map((product, index) => (
                                    <tr key={product.id}>
                                        <td data-label="Ranking">
                                            <RankBadge rank={index + 1}>#{index + 1}</RankBadge>
                                        </td>
                                        <td className="name" data-label="Produto">{product.name}</td>
                                        <td className="number" data-label="Quantidade">{product.total_quantity}</td>
                                        <td className="number" data-label="Pedidos">{product.order_count}</td>
                                        <td className="number" data-label="Preço Médio">{convertMoney(product.average_price)}</td>
                                        <td className="number positive" data-label="Receita">{convertMoney(product.total_revenue)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </TableContent>
                </TableSection>
            </div>
        );
    };

    const renderTopClients = () => {
        if (topClients.length === 0) {
            return (
                <EmptyState>
                    <div className="icon">
                        <FontAwesomeIcon icon={faInbox} />
                    </div>
                    <h3>Nenhum cliente encontrado</h3>
                    <p>Não há clientes com pedidos no período selecionado</p>
                </EmptyState>
            );
        }

        return (
            <div ref={reportRef}>
                <TableSection>
                    <TableHeader>
                        <TableTitle>
                            <h2>
                                <FontAwesomeIcon icon={faUsers} />
                                Clientes VIP
                            </h2>
                            <p className="subtitle">Ranking de clientes por valor total gasto</p>
                        </TableTitle>
                    </TableHeader>
                    <TableContent>
                        <table className="responsive-table">
                            <thead>
                                <tr>
                                    <th>Ranking</th>
                                    <th>Cliente</th>
                                    <th>Telefone</th>
                                    <th>Total de Pedidos</th>
                                    <th>Ticket Médio</th>
                                    <th>Total Gasto</th>
                                    <th>Último Pedido</th>
                                </tr>
                            </thead>
                            <tbody>
                                {topClients.map((client, index) => (
                                    <tr key={client.id}>
                                        <td data-label="Ranking">
                                            <RankBadge rank={index + 1}>#{index + 1}</RankBadge>
                                        </td>
                                        <td className="name" data-label="Cliente">{`${client.first_name} ${client.last_name}`}</td>
                                        <td data-label="Telefone">{client.phone_number}</td>
                                        <td className="number" data-label="Pedidos">{client.total_orders}</td>
                                        <td className="number" data-label="Ticket Médio">{convertMoney(client.average_order_value)}</td>
                                        <td className="number positive" data-label="Total Gasto">{convertMoney(client.total_spent)}</td>
                                        <td data-label="Último Pedido">{moment(client.last_order_date).format('DD/MM/YYYY')}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </TableContent>
                </TableSection>
            </div>
        );
    };

    const renderStockReport = () => {
        if (stockData.length === 0) {
            return (
                <EmptyState>
                    <div className="icon">
                        <FontAwesomeIcon icon={faInbox} />
                    </div>
                    <h3>Nenhum produto em estoque</h3>
                    <p>Não há produtos cadastrados no sistema</p>
                </EmptyState>
            );
        }

        const lowStockCount = stockData.filter(item => item.stock_status === 'low').length;
        const mediumStockCount = stockData.filter(item => item.stock_status === 'medium').length;
        const highStockCount = stockData.filter(item => item.stock_status === 'high').length;
        const totalValue = stockData.reduce((sum, item) => sum + item.current_value, 0);

        return (
            <div ref={reportRef}>
                <MetricsGrid>
                    <MetricCard color="#ef4444">
                        <div className="metric-header">
                            <div className="icon">🔴</div>
                            <div className="metric-label">Estoque Baixo</div>
                        </div>
                        <div className="metric-value">{lowStockCount}</div>
                        <div className="metric-trend neutral">Produtos com estoque crítico</div>
                    </MetricCard>

                    <MetricCard color="#f59e0b">
                        <div className="metric-header">
                            <div className="icon">🟡</div>
                            <div className="metric-label">Estoque Médio</div>
                        </div>
                        <div className="metric-value">{mediumStockCount}</div>
                        <div className="metric-trend neutral">Produtos em nível adequado</div>
                    </MetricCard>

                    <MetricCard color="#10b981">
                        <div className="metric-header">
                            <div className="icon">🟢</div>
                            <div className="metric-label">Estoque Alto</div>
                        </div>
                        <div className="metric-value">{highStockCount}</div>
                        <div className="metric-trend neutral">Produtos com estoque abundante</div>
                    </MetricCard>

                    <MetricCard color="#8b5cf6">
                        <div className="metric-header">
                            <div className="icon">
                                <FontAwesomeIcon icon={faDollarSign} />
                            </div>
                            <div className="metric-label">Valor Total</div>
                        </div>
                        <div className="metric-value">{convertMoney(totalValue)}</div>
                        <div className="metric-trend neutral">Valor do estoque atual</div>
                    </MetricCard>
                </MetricsGrid>

                <TableSection>
                    <TableHeader>
                        <TableTitle>
                            <h2>
                                <FontAwesomeIcon icon={faWarehouse} />
                                Inventário Completo
                            </h2>
                            <p className="subtitle">Detalhamento de todos os produtos em estoque</p>
                        </TableTitle>
                    </TableHeader>
                    <TableContent>
                        <table className="responsive-table">
                            <thead>
                                <tr>
                                    <th>Produto</th>
                                    <th>Estoque Atual</th>
                                    <th>Status</th>
                                    <th>Total Comprado</th>
                                    <th>Total Vendido</th>
                                    <th>Valor Investido</th>
                                    <th>Valor Atual</th>
                                </tr>
                            </thead>
                            <tbody>
                                {stockData.map(item => (
                                    <tr key={item.id}>
                                        <td className="name" data-label="Produto">{item.name}</td>
                                        <td className="number" data-label="Estoque">
                                            {item.current_stock} {item.unity}
                                        </td>
                                        <td data-label="Status">
                                            <span className={`status-badge ${item.stock_status}`}>
                                                {item.stock_status === 'low' ? '🔴 Baixo' :
                                                 item.stock_status === 'medium' ? '🟡 Médio' : '🟢 Alto'}
                                            </span>
                                        </td>
                                        <td className="number" data-label="Comprado">{item.total_purchased}</td>
                                        <td className="number" data-label="Vendido">{item.total_sold}</td>
                                        <td className="number" data-label="Investido">{convertMoney(item.total_invested)}</td>
                                        <td className="number positive" data-label="Valor Atual">{convertMoney(item.current_value)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </TableContent>
                </TableSection>
            </div>
        );
    };

    const renderFinancialReport = () => {
        if (!financialData) return null;

        const profitMargin = financialData.total_revenue > 0 
            ? ((financialData.gross_profit / financialData.total_revenue) * 100).toFixed(1)
            : '0.0';

        return (
            <div ref={reportRef}>
                <MetricsGrid>
                    <MetricCard color="#10b981">
                        <div className="metric-header">
                            <div className="icon">
                                <FontAwesomeIcon icon={faDollarSign} />
                            </div>
                            <div className="metric-label">Receita Total</div>
                        </div>
                        <div className="metric-value">{convertMoney(financialData.total_revenue)}</div>
                        <div className="metric-trend positive">Vendas totais</div>
                    </MetricCard>

                    <MetricCard color="#ef4444">
                        <div className="metric-header">
                            <div className="icon">
                                <FontAwesomeIcon icon={faDollarSign} />
                            </div>
                            <div className="metric-label">Custos Totais</div>
                        </div>
                        <div className="metric-value">{convertMoney(financialData.total_costs)}</div>
                        <div className="metric-trend negative">Custos de compra</div>
                    </MetricCard>

                    <MetricCard color="#8b5cf6">
                        <div className="metric-header">
                            <div className="icon">
                                <FontAwesomeIcon icon={faChartLine} />
                            </div>
                            <div className="metric-label">Lucro Bruto</div>
                        </div>
                        <div className="metric-value">{convertMoney(financialData.gross_profit)}</div>
                        <div className="metric-trend positive">Margem: {profitMargin}%</div>
                    </MetricCard>

                    <MetricCard color="#f59e0b">
                        <div className="metric-header">
                            <div className="icon">
                                <FontAwesomeIcon icon={faShoppingCart} />
                            </div>
                            <div className="metric-label">Pendente</div>
                        </div>
                        <div className="metric-value">{convertMoney(financialData.pending_amount)}</div>
                        <div className="metric-trend neutral">{financialData.total_orders_pending} pedidos</div>
                    </MetricCard>
                </MetricsGrid>

                <ChartSection>
                    <h2>
                        <FontAwesomeIcon icon={faChartBar} />
                        Visão Geral Financeira
                    </h2>
                    <p className="subtitle">Comparativo de receitas, custos e lucros</p>
                    <div style={{ height: '300px' }}>
                        <Bar
                            data={{
                                labels: ['Receita', 'Custos', 'Lucro Bruto', 'Recebido', 'Pendente'],
                                datasets: [{
                                    label: 'Valores',
                                    data: [
                                        financialData.total_revenue,
                                        financialData.total_costs,
                                        financialData.gross_profit,
                                        financialData.paid_amount,
                                        financialData.pending_amount
                                    ],
                                    backgroundColor: ['#10b981', '#ef4444', '#8b5cf6', '#3b82f6', '#f59e0b'],
                                    borderRadius: 8
                                }]
                            }}
                            options={{
                                responsive: true,
                                maintainAspectRatio: false,
                                plugins: {
                                    legend: { display: false },
                                    tooltip: {
                                        callbacks: {
                                            label: (context: any) => `Valor: ${convertMoney(context.parsed.y)}`
                                        }
                                    }
                                },
                                scales: {
                                    y: {
                                        beginAtZero: true,
                                        ticks: {
                                            callback: (value: any) => `R$ ${value.toFixed(2)}`
                                        }
                                    }
                                }
                            }}
                        />
                    </div>
                </ChartSection>

                {financialData.breakdown_by_payment_method.length > 0 && (
                    <TableSection>
                        <TableHeader>
                            <TableTitle>
                                <h2>
                                    <FontAwesomeIcon icon={faDollarSign} />
                                    Detalhamento por Método de Pagamento
                                </h2>
                                <p className="subtitle">Distribuição das vendas por forma de pagamento</p>
                            </TableTitle>
                        </TableHeader>
                        <TableContent>
                            <table className="responsive-table">
                                <thead>
                                    <tr>
                                        <th>Método</th>
                                        <th>Quantidade</th>
                                        <th>Valor Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {financialData.breakdown_by_payment_method.map(item => (
                                        <tr key={item.payment_method}>
                                            <td className="name" data-label="Método">
                                                {(PAYMENT_METHODS as any)[item.payment_method] || item.payment_method}
                                            </td>
                                            <td className="number" data-label="Quantidade">{item.count}</td>
                                            <td className="number positive" data-label="Valor">{convertMoney(item.total)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </TableContent>
                    </TableSection>
                )}
            </div>
        );
    };

    const renderDeliveryReport = () => {
        if (!deliveryData) return null;

        return (
            <div ref={reportRef}>
                <MetricsGrid>
                    <MetricCard color="#3b82f6">
                        <div className="metric-header">
                            <div className="icon">
                                <FontAwesomeIcon icon={faTruck} />
                            </div>
                            <div className="metric-label">Total de Entregas</div>
                        </div>
                        <div className="metric-value">{deliveryData.total_deliveries}</div>
                        <div className="metric-trend neutral">Entregas realizadas</div>
                    </MetricCard>

                    <MetricCard color="#10b981">
                        <div className="metric-header">
                            <div className="icon">✅</div>
                            <div className="metric-label">Entregas Pagas</div>
                        </div>
                        <div className="metric-value">{convertMoney(deliveryData.total_paid_value)}</div>
                        <div className="metric-trend positive">{deliveryData.deliveries_paid} entregas</div>
                    </MetricCard>

                    <MetricCard color="#f59e0b">
                        <div className="metric-header">
                            <div className="icon">⏳</div>
                            <div className="metric-label">Entregas Pendentes</div>
                        </div>
                        <div className="metric-value">{convertMoney(deliveryData.total_pending_value)}</div>
                        <div className="metric-trend neutral">{deliveryData.deliveries_pending} entregas</div>
                    </MetricCard>

                    <MetricCard color="#8b5cf6">
                        <div className="metric-header">
                            <div className="icon">
                                <FontAwesomeIcon icon={faDollarSign} />
                            </div>
                            <div className="metric-label">Total Geral</div>
                        </div>
                        <div className="metric-value">{convertMoney(deliveryData.total_paid_value + deliveryData.total_pending_value)}</div>
                        <div className="metric-trend neutral">Todas as entregas</div>
                    </MetricCard>
                </MetricsGrid>

                {deliveryData.deliveries_by_man.length > 0 && (
                    <TableSection>
                        <TableHeader>
                            <TableTitle>
                                <h2>
                                    <FontAwesomeIcon icon={faTruck} />
                                    Entregas por Motoboy
                                </h2>
                                <p className="subtitle">Performance individual dos entregadores</p>
                            </TableTitle>
                        </TableHeader>
                        <TableContent>
                            <table className="responsive-table">
                                <thead>
                                    <tr>
                                        <th>Motoboy</th>
                                        <th>Telefone</th>
                                        <th>Total Entregas</th>
                                        <th>Pagas</th>
                                        <th>Pendentes</th>
                                        <th>Valor Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {deliveryData.deliveries_by_man.map(man => (
                                        <tr key={man.id}>
                                            <td className="name" data-label="Motoboy">{man.name}</td>
                                            <td data-label="Telefone">{man.phone_number}</td>
                                            <td className="number" data-label="Total">{man.total_deliveries}</td>
                                            <td className="number" data-label="Pagas">{man.paid_deliveries}</td>
                                            <td className="number" data-label="Pendentes">{man.pending_deliveries}</td>
                                            <td className="number positive" data-label="Valor">{convertMoney(man.total_value)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </TableContent>
                    </TableSection>
                )}
            </div>
        );
    };

    const renderSupplierReport = () => {
        if (supplierData.length === 0) {
            return (
                <EmptyState>
                    <div className="icon">
                        <FontAwesomeIcon icon={faInbox} />
                    </div>
                    <h3>Nenhum fornecedor encontrado</h3>
                    <p>Não há transações com fornecedores no período selecionado</p>
                </EmptyState>
            );
        }

        const totalInvested = supplierData.reduce((sum, item) => sum + item.total_invested, 0);
        const totalTransactions = supplierData.reduce((sum, item) => sum + item.total_transactions, 0);

        return (
            <div ref={reportRef}>
                <MetricsGrid>
                    <MetricCard color="#3b82f6">
                        <div className="metric-header">
                            <div className="icon">
                                <FontAwesomeIcon icon={faIndustry} />
                            </div>
                            <div className="metric-label">Total Fornecedores</div>
                        </div>
                        <div className="metric-value">{supplierData.length}</div>
                        <div className="metric-trend neutral">Fornecedores ativos</div>
                    </MetricCard>

                    <MetricCard color="#10b981">
                        <div className="metric-header">
                            <div className="icon">
                                <FontAwesomeIcon icon={faShoppingCart} />
                            </div>
                            <div className="metric-label">Total Transações</div>
                        </div>
                        <div className="metric-value">{totalTransactions}</div>
                        <div className="metric-trend neutral">Compras realizadas</div>
                    </MetricCard>

                    <MetricCard color="#8b5cf6">
                        <div className="metric-header">
                            <div className="icon">
                                <FontAwesomeIcon icon={faDollarSign} />
                            </div>
                            <div className="metric-label">Total Investido</div>
                        </div>
                        <div className="metric-value">{convertMoney(totalInvested)}</div>
                        <div className="metric-trend neutral">Custo total de compras</div>
                    </MetricCard>

                    <MetricCard color="#f59e0b">
                        <div className="metric-header">
                            <div className="icon">
                                <FontAwesomeIcon icon={faChartLine} />
                            </div>
                            <div className="metric-label">Ticket Médio</div>
                        </div>
                        <div className="metric-value">
                            {convertMoney(totalTransactions > 0 ? totalInvested / totalTransactions : 0)}
                        </div>
                        <div className="metric-trend neutral">Valor médio por compra</div>
                    </MetricCard>
                </MetricsGrid>

                <TableSection>
                    <TableHeader>
                        <TableTitle>
                            <h2>
                                <FontAwesomeIcon icon={faIndustry} />
                                Fornecedores
                            </h2>
                            <p className="subtitle">Histórico de transações com fornecedores</p>
                        </TableTitle>
                    </TableHeader>
                    <TableContent>
                        <table className="responsive-table">
                            <thead>
                                <tr>
                                    <th>Fornecedor</th>
                                    <th>Transações</th>
                                    <th>Produtos Comprados</th>
                                    <th>Ticket Médio</th>
                                    <th>Total Investido</th>
                                    <th>Última Compra</th>
                                </tr>
                            </thead>
                            <tbody>
                                {supplierData.map(supplier => (
                                    <tr key={supplier.id}>
                                        <td className="name" data-label="Fornecedor">{supplier.name}</td>
                                        <td className="number" data-label="Transações">{supplier.total_transactions}</td>
                                        <td className="number" data-label="Produtos">{supplier.total_products_purchased}</td>
                                        <td className="number" data-label="Ticket Médio">{convertMoney(supplier.average_purchase_value)}</td>
                                        <td className="number positive" data-label="Total">{convertMoney(supplier.total_invested)}</td>
                                        <td data-label="Última Compra">{moment(supplier.last_purchase_date).format('DD/MM/YYYY')}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </TableContent>
                </TableSection>
            </div>
        );
    };

    const renderContent = () => {
        if (loading) {
            return (
                <LoadingContainer>
                    <div className="spinner"></div>
                    <p>Carregando dados...</p>
                </LoadingContainer>
            );
        }

        switch (activeTab) {
            case 'sales':
                return renderSalesReport();
            case 'products':
                return renderTopProducts();
            case 'clients':
                return renderTopClients();
            case 'stock':
                return renderStockReport();
            case 'financial':
                return renderFinancialReport();
            case 'delivery':
                return renderDeliveryReport();
            case 'supplier':
                return renderSupplierReport();
            default:
                return null;
        }
    };

    return (
        <Container>
            <Header>
                <h1>
                    <FontAwesomeIcon icon={faChartLine} />
                    Relatórios Gerenciais
                </h1>
                <p>Análise completa de vendas, produtos, clientes, estoque e finanças</p>
                <div className="header-actions">
                    {activeTab !== 'stock' && (
                        <DateRangePicker onDateRangeChange={handleDateRangeChange} />
                    )}
                    <ExportButton onClick={handleExportPDF} disabled={loading}>
                        <FontAwesomeIcon icon={faFileExport} />
                        Exportar PDF
                    </ExportButton>
                </div>
            </Header>

            <TabsContainer>
                <TabsList>
                    <Tab active={activeTab === 'sales'} onClick={() => setActiveTab('sales')}>
                        <FontAwesomeIcon icon={faChartLine} />
                        Vendas
                    </Tab>
                    <Tab active={activeTab === 'products'} onClick={() => setActiveTab('products')}>
                        <FontAwesomeIcon icon={faBoxOpen} />
                        Produtos
                    </Tab>
                    <Tab active={activeTab === 'clients'} onClick={() => setActiveTab('clients')}>
                        <FontAwesomeIcon icon={faUsers} />
                        Clientes
                    </Tab>
                    <Tab active={activeTab === 'stock'} onClick={() => setActiveTab('stock')}>
                        <FontAwesomeIcon icon={faWarehouse} />
                        Estoque
                    </Tab>
                    <Tab active={activeTab === 'financial'} onClick={() => setActiveTab('financial')}>
                        <FontAwesomeIcon icon={faDollarSign} />
                        Financeiro
                    </Tab>
                    <Tab active={activeTab === 'delivery'} onClick={() => setActiveTab('delivery')}>
                        <FontAwesomeIcon icon={faTruck} />
                        Entregas
                    </Tab>
                    <Tab active={activeTab === 'supplier'} onClick={() => setActiveTab('supplier')}>
                        <FontAwesomeIcon icon={faIndustry} />
                        Fornecedores
                    </Tab>
                </TabsList>

                <TabContent>
                    {renderContent()}
                </TabContent>
            </TabsContainer>
        </Container>
    );
}
