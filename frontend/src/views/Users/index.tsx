import { useState } from "react";

import { Container } from "./style";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash, faEye} from "@fortawesome/free-solid-svg-icons";
import { UserOrdersModal } from "../../components/UserOrdersModal";
import { useClients } from "../../contexts/ClientsContext";

export function UsersPage(){
    const { clients } = useClients();

    const [userOrderModal, setUserOrderModal] = useState(false)

    function handleOpenUserOrderModal(){
        setUserOrderModal(true)
    }
    function handleCloseUserOrderModal(){
        setUserOrderModal(false)
    }

    return(
        <Container>
            <table>
                <thead className="head">
                    <tr>
                        <th>Nome</th>
                        <th>Sobrenome</th>
                        <th>Telefone</th>
                        <th >Pedidos</th>
                        <th>Deletar</th>
                    </tr>
                </thead>
                <tbody>
                    {clients?.map(client => (
                        <tr key={client.id}>
                            <td>{client.first_name}</td>
                            <td>{client.last_name}</td>
                            <td>{client.phone_number}</td>
                            <td className="table-icon"><button className="view-button"><span>Visualizar</span> <FontAwesomeIcon icon={faEye}/></button></td>
                            <td className="table-icon"><button className="del-button"><span>Excluir</span> <FontAwesomeIcon icon={faTrash}/></button></td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <UserOrdersModal isOpen={userOrderModal} onRequestClose={handleCloseUserOrderModal}/>
        </Container>
    )
}