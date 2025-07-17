import Modal from 'react-modal';
import {
    Container,
} from './style';
import moment from 'moment';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark, faPrint } from "@fortawesome/free-solid-svg-icons";
import { PAYMENT_METHODS } from "../../constants";
import { IAdmin } from '../../interfaces/IAdmin';

interface AdminModalProps{
    isOpen: boolean;
    onRequestClose: ()=> void;
    order: any,
    orderCode: string,
    admins: IAdmin[]
}

export function CompletedOrderModal({
    isOpen,
    onRequestClose,
    order,
    orderCode,
    admins
}:AdminModalProps){
    function printOrder(order: any) {
    const date = new Date(order.delivery_date);

    const formattedDate = date.toLocaleDateString('pt-BR', {
        weekday: 'long',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    });

    const formattedTime = moment().locale('pt-br').format('HH:mm');

    const clientName = `${order.first_name || ''} ${order.last_name || ''}`.trim();
    const itemLines = order.products.map((product: any, index: number) => {
        const total = Number(product.price) * product.quantity;
        return (
            `${(index + 1).toString().padStart(3, '0')} ` + 
            `${product.name.padEnd(35).substring(0, 35)} ` +
            `${product.quantity.toString().padStart(3)}   ` +
            `UN   ` +
            `R$ ${total.toFixed(2).padStart(7)}`
        );
    }).join('\n');

    const paymentMethodKey = order.payment_method?.toUpperCase() as keyof typeof PAYMENT_METHODS;
    const paymentMethod = PAYMENT_METHODS[paymentMethodKey] || order.payment_method;

    const printContent = `
MIRAI FLORES
CNPJ: 33.861.078/0001-50
Tel: (22) 99751-7940
Itaperuna - RJ

COMPROVANTE DE VENDA
NÃO FISCAL

PEDIDO: #${orderCode}
DATA: ${formattedDate.toUpperCase()}
HORA: ${formattedTime}

ITEM DESCRIÇÃO                           QTD  UN   VALOR
${itemLines}

SUBTOTAL:                                R$ ${order.products_value.toFixed(2).padStart(7)}
TAXA DE ENTREGA:                         R$ ${order.delivery_fee.toFixed(2).padStart(7)}
----------------------------------------------
TOTAL:                                   R$ ${order.total.toFixed(2).padStart(7)}

FORMA DE PAGAMENTO:                     ${paymentMethod}
STATUS DO PAGAMENTO:                    ${order.payment_received ? 'PAGO' : 'NÃO PAGO'}
Vendedor(a): ${admins.find(admin => admin.id === order.created_by)?.name}

=== DADOS DO CLIENTE ===
NOME: ${clientName ? clientName.toUpperCase() : '---'}
TEL: ${order.phone_number ? order.phone_number : '---'}
----------------------------------------------
      OBRIGADO PELA PREFERÊNCIA!  
     MIRAI FLORES – SEMPRE COM VOCÊ  
----------------------------------------------
    `;

    const win = window.open('', '_blank', 'width=600,height=800');
    if (!win) return;

    win.document.write(`
        <html>
            <head>
                <title>Comprovante de Pedido</title>
                <style>
                    body {
                        font-family: monospace;
                        font-size: 12px;
                        white-space: pre;
                    }
                    @media print {
                        @page {
                            margin: 20mm;
                        }
                        header, footer {
                            display: none;
                        }
                    }
                </style>
            </head>
            <body>
    ${printContent}
            </body>
        </html>
    `);
    win.document.close();
    win.focus();
    win.print();
}

    return(
        <Modal 
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            overlayClassName="react-modal-overlay"
            className="react-modal-content"
        >
            <Container>
                <h2>Pedido Concluído 💐</h2>
                <p>O pedido foi salvo e se encontra nos pedidos finalizados!</p>
                <div>
                    <button onClick={() => printOrder(order)}>
                        <span>Imprimir</span>
                        <FontAwesomeIcon icon={faPrint}/>
                    </button>
                    <button type="button" onClick={onRequestClose}>
                        <span>Fechar</span>
                        <FontAwesomeIcon icon={faXmark}/>
                    </button>
                </div>

            </Container>
        </Modal>
    )
}
