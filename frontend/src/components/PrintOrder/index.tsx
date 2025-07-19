import moment from "moment";
import 'moment/locale/pt-br';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPrint } from "@fortawesome/free-solid-svg-icons";
import { IAdmin } from "../../interfaces/IAdmin";
import { PAYMENT_METHODS } from "../../constants";
import { formatTitleCase, formatDescriptionWithPrice, convertMoney } from "../../utils";
import { PrintButton } from "./style";

moment.locale('pt-br');

interface IReceiptPrintProps {
    order: any;
    orderCode: string;
    admins: IAdmin[];
    clientName: string;
    clientTelephone: string;
    buttonLabel?: string;
    style?: React.CSSProperties
}

export const PrintOrder = ({
    order,
    orderCode,
    admins,
    clientName,
    clientTelephone,
    buttonLabel = "Imprimir",
    style
}: IReceiptPrintProps) => {
    const date = moment();

    const handlePrint = () => {
        // Status do pagamento
        const paymentStatus = order.payment_received ? "Pago" : "Pendente";
        const paymentMethodKey = order.payment_method?.toUpperCase() as keyof typeof PAYMENT_METHODS;
        const paymentMethod = PAYMENT_METHODS[paymentMethodKey] || order.payment_method;

        const receiptHTML = `
            <html>
                <head>
                    <title>Comprovante</title>
                    <style>
                        body { font-family: Arial, sans-serif; padding: 20px; }
                        h1 { font-weight: bold; font-family: monospace; }
                        h3, h2, h1, p, div { margin: 2px 0; }
                        .center { text-align: center; }
                        .row { display: flex; margin: 4px 0; }
                        .divider { border-top: 1px dashed #ccc; margin: 10px 0; }
                        strong { margin-right: 4px; }
                        .center-text { display:flex; flex-direction: column; text-align: center; margin: 10px 0;}
                        .center-text p { line-height: 12px }
                        .footer { text-align:center; margin: 25px 0;}
                        div { font-size: 15px;}
                    </style>
                </head>
                <body>
                    <div class="center">
                        <div><h1>MIRAI FLORES</h1></div>
                        <div>CNPJ: 33.861.078/0001-50</div>
                        <div>Tel: (22) 99751-7940</div>
                        <div>Itaperuna - RJ</div>
                        <br />
                        <strong>COMPROVANTE DE VENDA</strong>
                        <div>NÃO FISCAL</div>
                    </div>

                    <div class="row"><strong>Pedido:</strong> #${orderCode}</div>
                    <div class="row"><strong>Data:</strong> ${order.created_at ? moment(order.created_at).format("DD/MM/YYYY (dddd)") : date.format("DD/MM/YYYY (dddd)")}</div>
                    <div class="row"><strong>Hora:</strong> ${order.created_at ? moment(order.created_at).format("HH:mm") : date.format("HH:mm")}</div>
                    <div class="divider"></div>
                    <div class="center-text">
                        <p>=====</p>
                        <p>ITEMS</p>
                        <p>=====</p>
                    </div>
                    ${formatDescriptionWithPrice(order.description).map((item, index) => `
                        <div class="row">${item}</div>
                    `).join('')}
                    ${order.additional_information ? 
                        `<p style="font-size: 14px;"><strong>Observação: </strong>${order.additional_information}</p>`
                        : ''
                    }
                    <br />
                    <div class="row"><strong>Subtotal:</strong> ${convertMoney(order.products_value)}</div>
                    <div class="row"><strong>Taxa de Entrega:</strong> ${convertMoney(order.delivery_fee)}</div>
                    ${(order.pickup_on_store || order.is_delivery===false) ?
                        `<div class="row"><strong>Retirada na loja</strong></div>`
                        :''
                    }
                    <div class="divider"></div>
                    <div class="row"><strong>Total:</strong> ${convertMoney(order.total)}</div>

                    <br />
                    <div class="row"><strong>Forma de pagamento:</strong> ${paymentMethod || '---'}</div>
                    <div class="row"><strong>Status do pagamento:</strong> ${paymentStatus}</div>
                    <div class="row"><strong>Vendedor(a):</strong> ${admins.find((admin: IAdmin) => admin.id === order.created_by)?.name || '---'}</div>

                    <div class="center-text">
                        <p>=====</p>
                        <p>DADOS DO CLIENTE</p>
                        <p>=====</p>
                    </div>
                    <div class="row"><strong>Nome:</strong>${formatTitleCase(clientName) || '---'}</div>
                    <div class="row"><strong>Telefone:</strong>${clientTelephone || '---'}</div>

                    <div class="divider"></div>
                    ${order.is_delivery
                        ? `<div class="center-text">
                                <p>=====</p>
                                <p>ENTREGA</p>
                                <p>=====</p>
                            </div>
                            <div>
                            <p><strong>Endereço:</strong>
                                <span>${formatTitleCase(order.clientAddress.street)}, ${order.clientAddress.street_number},
                                </span>
                                <span>${formatTitleCase(order.clientAddress.neighborhood)}, ${formatTitleCase(order.clientAddress.city)}</span>
                            </p>
                            <p><strong>Complemento:</strong> ${formatTitleCase(order.clientAddress.complement)}</p>
                            <p><strong>Ponto de Referência:</strong> ${formatTitleCase(order.clientAddress.reference_point)}</p>
                            <p><strong>Entregar para:</strong> ${formatTitleCase(order.receiver_name) || formatTitleCase(clientName)}</p>
                            <p><strong>Telefone do recebedor:</strong> ${order.receiver_phone || clientTelephone}</p>
                            </div>
                            `
                        : ``
                    }

                    <p><strong>Cartão:</strong> ${order.has_card ? 'Contém cartão' : 'Não contém cartão'}</p>

                    <div class="footer">
                        <div>OBRIGADO PELA PREFERÊNCIA!</div>
                        <div>FLORES, SEMPRE</div>
                        <div>UMA ÓTIMA IDEIA</div>
                    </div>
                </body>
            </html>
        `;

        const printWindow = window.open('', '', 'height=840,width=1100');
        if (printWindow) {
            printWindow.document.write(receiptHTML);
            printWindow.document.close();
            printWindow.focus();
            printWindow.print();
        }
    };

    return (
        <PrintButton onClick={handlePrint} style={style}>
            {buttonLabel && <span>{buttonLabel}</span>}
            <FontAwesomeIcon icon={faPrint} />
        </PrintButton>
    );
};
