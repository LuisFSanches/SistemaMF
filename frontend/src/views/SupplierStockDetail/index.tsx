import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import moment from 'moment';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faBoxes,
    faWarehouse,
    faDollarSign,
    faCalendarAlt,
    faHistory,
    faInbox
} from "@fortawesome/free-solid-svg-icons";
import { getSupplierStockDetails } from "../../services/supplierService";
import { convertMoney } from "../../utils";
import { Loader } from "../../components/Loader";
import {
    Container,
    Header,
    MetricsGrid,
    MetricCard,
    TableSection,
    EmptyState
} from "./style";

interface ISupplierStockData {
    supplier_info: {
        id: string;
        name: string;
    };
    transactions: Array<{
        id: string;
        purchased_date: string;
        store_product_id: string | null;
        product_name: string;
        unity: string;
        quantity: number;
        unity_price: number;
        total_price: number;
    }>;
    metrics: {
        total_transactions: number;
        total_quantity_purchased: number;
        total_spent: number;
        average_price: number;
        last_purchase_date: string | null;
    };
}

export function SupplierStockDetail() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [stockData, setStockData] = useState<ISupplierStockData | null>(null);

    useEffect(() => {
        const fetchStockData = async () => {
            try {
                setLoading(true);
                const response = await getSupplierStockDetails(id as string);
                setStockData(response.data);
            } catch (error) {
                console.error("Error fetching supplier stock data:", error);
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
                    <h3>Fornecedor não encontrado</h3>
                    <p>Não foi possível carregar as informações deste fornecedor</p>
                </EmptyState>
            </Container>
        );
    }

    const { supplier_info, transactions, metrics } = stockData;

    return (
        <Container>
            <Header>
                <div className="supplier-info">
                    <div>
                        <h1>{supplier_info.name}</h1>
                        <p>Detalhes e histórico de compras do fornecedor</p>
                    </div>
                </div>
            </Header>

            <MetricsGrid>
                <MetricCard color="#ec4899">
                    <div className="metric-header">
                        <div className="icon">
                            <FontAwesomeIcon icon={faHistory} />
                        </div>
                        <div className="metric-label">Total de Compras</div>
                    </div>
                    <div className="metric-value">{metrics.total_transactions}</div>
                    <div className="metric-trend">
                        Compras registradas
                    </div>
                </MetricCard>

                <MetricCard color="#8b5cf6">
                    <div className="metric-header">
                        <div className="icon">
                            <FontAwesomeIcon icon={faBoxes} />
                        </div>
                        <div className="metric-label">Quantidade Total</div>
                    </div>
                    <div className="metric-value">{metrics.total_quantity_purchased}</div>
                    <div className="metric-trend">
                        Unidades compradas
                    </div>
                </MetricCard>

                <MetricCard color="#10b981">
                    <div className="metric-header">
                        <div className="icon">
                            <FontAwesomeIcon icon={faWarehouse} />
                        </div>
                        <div className="metric-label">Total Investido</div>
                    </div>
                    <div className="metric-value">{convertMoney(metrics.total_spent)}</div>
                    <div className="metric-trend">
                        Preço médio: {convertMoney(metrics.average_price)}
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
                        {metrics.last_purchase_date ? moment(metrics.last_purchase_date).format('DD/MM/YYYY') : '-'}
                    </div>
                    <div className="metric-trend">
                        {transactions[0]?.product_name || ''}
                    </div>
                </MetricCard>
            </MetricsGrid>

            <TableSection>
                <h2>
                    <FontAwesomeIcon icon={faDollarSign} />
                    Histórico de Compras
                </h2>
                <p className="subtitle">Todas as compras registradas com este fornecedor</p>

                {transactions.length > 0 ? (
                    <table>
                        <thead>
                            <tr>
                                <th>Data</th>
                                <th>Produto</th>
                                <th>Quantidade</th>
                                <th>Preço Unit.</th>
                                <th>Preço Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transactions.map(transaction => (
                                <tr key={transaction.id}>
                                    <td>{moment(transaction.purchased_date).format('DD/MM/YYYY')}</td>
                                    <td className="product-name">
                                        {transaction.store_product_id ? (
                                            <span
                                                onClick={() => navigate(`/backoffice/estoque/produto/${transaction.store_product_id}`)}
                                                style={{ cursor: 'pointer' }}
                                            >
                                                {transaction.product_name}
                                            </span>
                                        ) : (
                                            transaction.product_name
                                        )}
                                    </td>
                                    <td>{transaction.quantity} {transaction.unity}</td>
                                    <td>{convertMoney(transaction.unity_price)}</td>
                                    <td className="total-price">{convertMoney(transaction.total_price)}</td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot>
                            <tr>
                                <td colSpan={4}>Total Investido</td>
                                <td className="total-price">{convertMoney(metrics.total_spent)}</td>
                            </tr>
                        </tfoot>
                    </table>
                ) : (
                    <EmptyState>
                        <div className="icon">
                            <FontAwesomeIcon icon={faInbox} />
                        </div>
                        <h3>Nenhuma compra registrada</h3>
                        <p>Ainda não há histórico de compras deste fornecedor</p>
                    </EmptyState>
                )}
            </TableSection>
        </Container>
    );
}
