import { useState } from "react";

import { Container } from "./style";
import { PageHeader } from "../../styles/global";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash, faEye, faPlus, faPen } from "@fortawesome/free-solid-svg-icons";
import { ClientModal } from "../../components/ClientModal";
import { useOrders } from "../../contexts/OrdersContext";
import { statusLabel } from "../../constants";

export function OrdersPage(){
    const { orders } = useOrders();
	console.log(orders);

    const [clientModalModal, setClientModal] = useState(false);
    const [action, setAction] = useState("");
    const [currentClient, setCurrentClient] = useState({
        id: "",
        first_name: "",
        last_name: "",
        phone_number: ""
    });

    function handleOpenClientModal(action:string, client: any){
        setClientModal(true)
        setAction(action)
        setCurrentClient(client)
    }
    function handleCloseClientModal(){
        setClientModal(false)
    }

    return(
        <Container>
            <PageHeader>
            	<h1>Pedidos</h1>
            </PageHeader>
            <table>
                <thead className="head">
                    <tr>
                        <th>Pedido</th>
                        <th>Descrição</th>
                        <th>Cliente</th>
                        <th>Status</th>
                        <th>Total</th>
                        <th>Visualizar</th>
                    </tr>
                </thead>
                <tbody>
                    {orders?.map(order => (
                        <tr key={order.id}>
                            <td>#{order.code}</td>
                            <td>{order.description}</td>
                            <td>{order.client.first_name} {order.client.last_name}</td>
                            <td>{statusLabel[order.status]}</td>
                            <td>R$ {order.total}</td>

                            <td className="table-icon">
                                <button className="view-button">
                                    <span>Visualizar</span> <FontAwesomeIcon icon={faEye}/>
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <ClientModal
                isOpen={clientModalModal}
                onRequestClose={handleCloseClientModal}
                loadData={() => {}}
                action={action}
                currentClient={currentClient}
            />
        </Container>
    )
}
