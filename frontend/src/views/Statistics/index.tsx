import { useEffect, useState } from "react";
import moment from "moment";
// import { FontAwesomeIcon, } from "@fortawesome/react-fontawesome";
// import { faUser, faCoins, faUtensils, faBasketShopping } from "@fortawesome/free-solid-svg-icons";
import { getTopClients, getDailySales } from"../../services/statistics";
import {
    //BottomInfo,
    ChartArea,
    Container,
    //HeaderCard,
    //HeaderInfo
} from "./style";
import { LineHomeChart } from "../../components/LineHomeChart";
import { BarHomeChart } from "../../components/BarHomeChart";
// import { TopClients } from "../../components/TopClients";
// import { PaymentStatusTable } from "../../components/PaymentStatusTable";

export function Statistics(){
    const [topClients, setTopClients] = useState([]);
    const [topClientsLabel, setTopClientsLabel] = useState([]);
    const [topClientsValue, setTopClientsValue] = useState([]);
    const [dailySales, setDailySales] = useState([]);

    async function fetchTopClients() {
        const initial_date = moment().subtract(30, "days").format("YYYY-MM-DD");
        const final_date = moment().add(1, "days").format("YYYY-MM-DD");
        const params = `?initial_date=${initial_date}&final_date=${final_date}&limit=5`;
        const response = await getTopClients(params);
        setTopClients(response);

        const clientsName = response.filter((client: any) => client.first_name !== null).map((client: any) => 
            `${client.first_name} ${client.last_name}`);
        setTopClientsLabel(clientsName);

        const clientsValue = response.filter((client: any) => client.first_name !== null).map((client: any) => 
            client.totalOrders);
        setTopClientsValue(clientsValue);
    }

    async function fetchDailySales() {
        const initial_date = moment().subtract(7, "days").format("YYYY-MM-DD");
        const final_date = moment().add(1, "days").format("YYYY-MM-DD");
        const params = `?initial_date=${initial_date}&final_date=${final_date}`;

        const response = await getDailySales(params);
        setDailySales(response);
    }

    useEffect(() => {
        fetchTopClients();
        fetchDailySales();
    }, []);

    console.log(dailySales);

    return(
        <Container>
            {/*
            <HeaderInfo className="column">
                <HeaderCard>
                    <div className="header-card-title">
                        <FontAwesomeIcon icon={faUser} className="header-icon"/>
                        <span>Nº de usuários</span>
                    </div>
                    <p>100</p>
                    <footer>
                        <svg viewBox="0 -20 700 110" width="100%" height="43" preserveAspectRatio="none">
                            <path transform="translate(0, -20)" d="M0,10 c80,-22 240,0 350,18 c90,17 260,7.5 350,-20 v50 h-700" fill="#f85a16" />
                            <path d="M0,10 c80,-18 230,-12 350,7 c80,13 260,17 350,-5 v100 h-700z" fill="#f85a16" />
                        </svg>
                    </footer>
                </HeaderCard>

                <HeaderCard>
                    <div className="header-card-title">
                        <FontAwesomeIcon icon={faCoins} className="header-icon"/>
                        <span>Venda Semanal</span>
                    </div>
                    <p>R$ 500</p>
                    <footer>
                        <svg viewBox="0 -20 700 110" width="100%" height="43" preserveAspectRatio="none">
                            <path transform="translate(0, -20)" d="M0,10 c80,-22 240,0 350,18 c90,17 260,7.5 350,-20 v50 h-700" fill="#66d33b" />
                            <path d="M0,10 c80,-18 230,-12 350,7 c80,13 260,17 350,-5 v100 h-700z" fill="#66d33b" />
                        </svg>
                    </footer>
                </HeaderCard>

                <HeaderCard>
                    <div className="header-card-title">
                        <FontAwesomeIcon icon={faBasketShopping} className="header-icon"/>
                        <span>Pedidos/Semana</span>
                    </div>
                    <p>25</p>
                    <footer>
                        <svg viewBox="0 -20 700 110" width="100%" height="43" preserveAspectRatio="none">
                            <path transform="translate(0, -20)" d="M0,10 c80,-22 240,0 350,18 c90,17 260,7.5 350,-20 v50 h-700" fill="#e3ea0e" />
                            <path d="M0,10 c80,-18 230,-12 350,7 c80,13 260,17 350,-5 v100 h-700z" fill="#e3ea0e" />
                        </svg>
                    </footer>
                </HeaderCard>

                <HeaderCard>
                    <div className="header-card-title">
                        <FontAwesomeIcon icon={faUtensils} className="header-icon"/>
                        <span>Nº de Produtos</span>
                    </div>
                    <p>12</p>
                    <footer>
                        <svg viewBox="0 -20 700 110" width="100%" height="43" preserveAspectRatio="none">
                            <path transform="translate(0, -20)" d="M0,10 c80,-22 240,0 350,18 c90,17 260,7.5 350,-20 v50 h-700" fill="#f77b29" />
                            <path d="M0,10 c80,-18 230,-12 350,7 c80,13 260,17 350,-5 v100 h-700z" fill="#f77b29" />
                        </svg>
                    </footer>
                </HeaderCard>
            </HeaderInfo>*/}

            <ChartArea className="column">
                <LineHomeChart
                    title="Venda Semanal" labels={Object.keys(dailySales)} values={Object.values(dailySales)}
                />
                <BarHomeChart
                    title="Top 5 Clientes dos últimos 30 dias"
                    data={topClients}
                    labels={topClientsLabel}
                    values={topClientsValue}
                />
            </ChartArea>
            {/*
            <BottomInfo className="column">
                <TopClients/>
                <PaymentStatusTable/>
            </BottomInfo>
            */}
        </Container>
    )
}