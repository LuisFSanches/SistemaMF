import { Container } from "./style";


import hamburguer from '../../assets/images/hamburguer.png'
import combo from '../../assets/images/combo.png'
import desert from '../../assets/images/desert.png'


export function MostOrderedTable(){
    return(
        <Container>
            <table className="Most-Ordered-Table">
                <caption>Produtos mais vendidos no mês</caption>
                <thead>
                    <tr>
                        <th>Produto</th>
                        <th>Nome</th>
                        <th>Total de Vendas</th>
                    </tr>
                </thead>
                <tbody>
                   <tr>
                       <td><img src={hamburguer} alt="hamburguer" /></td>
                       <td>Hamburguer</td>
                       <td>200 UND</td>
                   </tr>

                   <tr>
                       <td><img src={combo} alt="hamburguer" /></td>
                       <td>Combo</td>
                       <td>180 UND</td>
                   </tr>

                   <tr>
                       <td><img src={desert} alt="hamburguer" /></td>
                       <td>Sorvete</td>
                       <td>100 UND</td>
                   </tr>

                   <tr>
                       <td><img src={desert} alt="hamburguer" /></td>
                       <td>Sorvete</td>
                       <td>100 UND</td>
                   </tr>
                </tbody>
            </table>
        </Container>
    )
}