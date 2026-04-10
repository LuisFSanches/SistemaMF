import { useEffect, useState } from 'react'
import { SummaryCard } from '../../components/SummaryCard'
import { FilterToggle } from '../../components/FilterToggle'
import { TopAdmins } from '../../components/TopAdmins'
import { getDashboard } from '../../services/dashboard'
import { Container, Header, Grid, SectionTitle } from './style'
import { 
    faShoppingCart, 
    faMoneyBillWave, 
    faCheckCircle, 
    faClock,
    faStore,
    faGlobe,
    faCreditCard
} from '@fortawesome/free-solid-svg-icons'
import { faPix, faWhatsapp } from '@fortawesome/free-brands-svg-icons'

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
                <SummaryCard 
                    title="Quantidade de Vendas" 
                    value={data.totalOrders} 
                    icon={faShoppingCart}
                    color="#8b5cf6"
                />
                <SummaryCard 
                    title="Total de Vendas" 
                    value={`R$ ${data.totalAmount.toFixed(2)}`} 
                    icon={faMoneyBillWave}
                    color="#22c55e"
                />
                <SummaryCard 
                    title="Recebido" 
                    value={`R$ ${data.amountReceived.toFixed(2)}`} 
                    icon={faCheckCircle}
                    color="#3b82f6"
                />
                <SummaryCard 
                    title="A Receber" 
                    value={`R$ ${data.amountPending.toFixed(2)}`} 
                    icon={faClock}
                    color="#f59e0b"
                />
            </Grid>

            <SectionTitle>Tipos de Vendas</SectionTitle>
            
            <Grid style={{ gridTemplateColumns: '1fr 1fr 1fr' }}>
                <SummaryCard 
                    title="Vendas Via Balcão" 
                    value={data.inStoreOrders} 
                    icon={faStore}
                    color="#71265D"
                />
                <SummaryCard 
                    title="Vendas Via Whatsapp" 
                    value={data.whatsAppOrders} 
                    icon={faWhatsapp}
                    color="#25D366"
                />
                <SummaryCard 
                    title="Vendas Via Online" 
                    value={data.onlineOrders} 
                    icon={faGlobe}
                    color="#3b82f6"
                />
            </Grid>

            <SectionTitle>Formas de Pagamento</SectionTitle>
            <Grid style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
                <SummaryCard 
                    title="Dinheiro" 
                    value={data.paymentMethods.CASH} 
                    icon={faMoneyBillWave}
                    color="#10b981"
                />
                <SummaryCard 
                    title="Pix" 
                    value={data.paymentMethods.PIX} 
                    icon={faPix}
                    color="#00C9A7"
                />
                <SummaryCard 
                    title="Cartão" 
                    value={data.paymentMethods.CARD} 
                    icon={faCreditCard}
                    color="#ec4899"
                />
            </Grid>

            <TopAdmins admins={data.admins} />
        </Container>
    )
}
