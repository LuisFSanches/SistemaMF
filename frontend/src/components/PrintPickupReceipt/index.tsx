import moment from "moment";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFileInvoice } from "@fortawesome/free-solid-svg-icons";
import { formatTitleCase, formatDescription } from "../../utils";
import { PrintReceiptButton } from "./style";

moment.locale('pt-br');

interface IPickupReceiptPrintProps {
    order: any;
    orderCode: string;
    clientName: string;
    clientTelephone: string;
}

export const PrintPickupReceipt = ({
    order,
    orderCode,
    clientName,
    clientTelephone,
}: IPickupReceiptPrintProps) => {
    const handlePrint = async () => {
        try {
            const deliveryDate = moment(order.delivery_date).format("DD/MM/YYYY");

            const receiptHTML = `
            <html>
                <head>
                    <title>Comprovante de Retirada</title>
                    <style>
                        @media print {
                            @page {
                                margin: 0;
                            }
                            body {
                                margin: 1cm;
                            }
                        }
                        
                        body { 
                            font-family: 'Courier New', monospace; 
                            padding: 20px;
                            max-width: 300px;
                            margin: 0 auto;
                            font-size: 14px;
                        }
                        .header {
                            text-align: center;
                            border-bottom: 1px dashed #333;
                            padding-bottom: 10px;
                            margin-bottom: 15px;
                        }
                        .header h1 {
                            margin: 0;
                            font-size: 18px;
                            font-weight: bold;
                        }
                        .header .separator {
                            margin: 5px 0;
                        }
                        .section {
                            margin: 15px 0;
                            border-bottom: 1px dashed #333;
                            padding-bottom: 10px;
                        }
                        .section-title {
                            font-weight: bold;
                            text-transform: uppercase;
                            margin-bottom: 5px;
                        }
                        .info-row {
                            margin: 3px 0;
                        }
                        .order-number {
                            text-align: center;
                            font-size: 16px;
                            font-weight: bold;
                            margin: 10px 0;
                        }
                        .footer {
                            text-align: center;
                            margin-top: 20px;
                            font-size: 12px;
                        }
                        .product-list {
                            margin: 5px 0;
                        }
                        .product-item {
                            margin: 3px 0;
                            line-height: 1.4;
                        }
                    </style>
                </head>
                <body>
                    <div class="header">
                        <h1>MIRAI FLORES </h1>
                        <div>CNPJ: 33.861.078/0001-50</div>
                        <div>Tel: (22) 99751-7940</div>
                        <div>Itaperuna - RJ</div>
                    </div>

                    <div class="order-number">
                        PEDIDO #${orderCode}
                    </div>

                    <div class="section">
                        <div class="info-row"><strong>Cliente:</strong> ${formatTitleCase(clientName)}</div>
                        <div class="info-row"><strong>Telefone:</strong> ${clientTelephone}</div>
                    </div>

                    <div class="section">
                        <div class="section-title">PRODUTO</div>
                        <div class="product-list">
                            ${formatDescription(order.description).map((item) => `
                                <div class="product-item">${item}</div>
                            `).join('')}
                        </div>
                    </div>

                    <div class="section">
                        <div class="section-title">RETIRADA</div>
                        <div class="info-row"><strong>Data:</strong> ${deliveryDate}</div>
                    </div>

                    <div class="footer">
                        <p>Apresente este comprovante</p>
                        <p>para retirada do pedido.</p>
                        <br>
                        <p><strong>Obrigado! 💛</strong></p>
                    </div>
                </body>
            </html>
        `;

            const printWindow = window.open('', '', 'height=600,width=400');
            if (printWindow) {
                printWindow.document.write(receiptHTML);
                printWindow.document.close();
                printWindow.focus();

                setTimeout(() => {
                    printWindow.print();
                }, 300);
            } else {
            }
        } catch (error) {
            console.error("Erro ao imprimir comprovante:", error);
            alert("Não foi possível gerar o comprovante. Tente novamente.");
        }
    };

    return (
        <>
            <PrintReceiptButton onClick={handlePrint} title="Imprimir comprovante de retirada">
                <FontAwesomeIcon icon={faFileInvoice} />
            </PrintReceiptButton>
        </>
    );
};
