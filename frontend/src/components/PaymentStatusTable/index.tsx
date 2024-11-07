import { Container } from "./style";
import tableImage from '../../assets/images/restaurant-table.png'

export function PaymentStatusTable(){
    return(
        <Container>
            <table className="Payment-Table">
                <caption>Status dos pedidos nas mesas</caption>
                <thead>
                    <tr>
                        <th>Mesa</th>
                        <th>Valor a Receber</th>
                        <th>Pagamento</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td >
                            <div className="Table-Div">
                                <img src={tableImage} alt="" />
                                <span>1</span>
                            </div>
                        </td>
                        <td>R$ 50</td>
                        <td>EM ABERTO</td>
                    </tr>

                    <tr>
                        <td >
                            <div className="Table-Div">
                                <img src={tableImage} alt="" />
                                <span>2</span>
                            </div>
                        </td>
                        <td>R$ 50</td>
                        <td>EM ABERTO</td>
                    </tr>

                    <tr>
                        <td >
                            <div className="Table-Div">
                                <img src={tableImage} alt="" />
                                <span>3</span>
                            </div>
                        </td>
                        <td>R$ 50</td>
                        <td>EM ABERTO</td>
                    </tr>
                    
                </tbody>
            </table>
        </Container>
    )
}