import { useEffect, useState } from 'react'
import { SummaryCard } from '../../components/SummaryCard'
import { OrdersTable } from '../../components/OrdersTable'
import { FilterToggle } from '../../components/FilterToggle'
import { TopAdmins } from '../../components/TopAdmins'
import { getDashboard } from '../../services/dashboard'
import { Container, Header, Grid, Row, RecentOrders } from './style'

export function Dashboard() {
    const [period, setPeriod] = useState<'day' | 'week' | 'month' | 'year'>('day')
    const [data, setData] = useState<any>(null)

    async function fetchDashboard(period: string) {
        const response = await getDashboard(period);
        setData(response.data);
    }

    useEffect(() => {
        fetchDashboard(period);
    }, [period])

    if (!data) return <p>Carregando...</p>

    return (
        <Container>
            <Header>
                <h1>Dashboard</h1>
                <FilterToggle value={period} onChange={setPeriod} />
            </Header>

            <Grid>
                <SummaryCard title="Quantidade de Vendas" value={data.totalOrders} />
                <SummaryCard title="Total de Vendas" value={`R$ ${data.totalAmount.toFixed(2)}`} />
                <SummaryCard title="Recebido" value={`R$ ${data.amountReceived.toFixed(2)}`} />
                <SummaryCard title="A Receber" value={`R$ ${data.amountPending.toFixed(2)}`} />
            </Grid>

            <p>Tipos de Vendas</p>
            
            <Grid style={{ gridTemplateColumns: '1fr 1fr', marginTop: '10px' }}>
                <SummaryCard title="Vendas Via Balcão" value={data.inStoreOrders} />
                <SummaryCard title="Vendas Via Online" value={data.onlineOrders} />
            </Grid>

            <p>Formas de Pagamento</p>
            <Grid style={{ gridTemplateColumns: 'repeat(3, 1fr)', marginTop: '10px' }}>
                <SummaryCard title="Dinheiro" value={data.paymentMethods.CASH} />
                <SummaryCard title="Pix" value={data.paymentMethods.PIX} />
                <SummaryCard title="Cartão" value={data.paymentMethods.CARD} />
            </Grid>

            <Row>
                <RecentOrders>
                    <h2>Pedidos Recentes</h2>
                    <OrdersTable orders={data.recentOrders} />
                </RecentOrders>
                <TopAdmins admins={data.admins} />
            </Row>
        </Container>
    )
}
