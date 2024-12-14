import { FontAwesomeIcon, } from "@fortawesome/react-fontawesome";
import { faUser, faCoins, faUtensils, faBasketShopping } from "@fortawesome/free-solid-svg-icons";
import { BottomInfo, ChartArea, Container, HeaderCard, HeaderInfo } from "./style";
import { LineHomeChart } from "../../components/LineHomeChart";
import { BarHomeChart } from "../../components/BarHomeChart";
import { MostOrderedTable } from "../../components/MostOrderedTable";
import { PaymentStatusTable } from "../../components/PaymentStatusTable";

export function Statistics(){
    const hasStatistic = false;

    if (!hasStatistic) {
        return (
            <>
            </>
        )
    }

    return(
        <Container>
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
            </HeaderInfo>

            <ChartArea className="column">
                <LineHomeChart/>
                <BarHomeChart/>
            </ChartArea>
            
            <BottomInfo className="column">
                <MostOrderedTable/>
                <PaymentStatusTable/>
            </BottomInfo>
        </Container>
    )
}