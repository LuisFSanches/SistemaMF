import { useState, useEffect } from "react";

import { Container } from "./style";
import { AddButton, PageHeader } from "../../styles/global";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash, faEye, faPlus, faPen } from "@fortawesome/free-solid-svg-icons";
import { ClientModal } from "../../components/ClientModal";
import { useClients } from "../../contexts/ClientsContext";

export function UsersPage(){
    const { clients, loadAvailableClients } = useClients();

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

    useEffect(() => {
        loadAvailableClients();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return(
        <Container>
            <PageHeader>
                <h1>Clientes</h1>

                <AddButton onClick={() =>handleOpenClientModal("create", {
                    id: "",
                    first_name: "",
                    last_name: "",
                    phone_number: ""
                })}>
                    <FontAwesomeIcon icon={faPlus}/>
                    <p>Novo Cliente</p>
                </AddButton>
            </PageHeader>
            
            <table>
                <thead className="head">
                    <tr>
                        <th>Nome</th>
                        <th>Sobrenome</th>
                        <th>Telefone</th>
                        <th>Endereços</th>
                        <th>Editar</th>
                        <th>Deletar</th>
                    </tr>
                </thead>
                <tbody>
                    {clients?.map(client => (
                        <tr key={client.id}>
                            <td>{client.first_name}</td>
                            <td>{client.last_name}</td>
                            <td>{client.phone_number}</td>
                            <td className="table-icon">
                                <button className="view-button">
                                    <span>Visualizar</span> <FontAwesomeIcon icon={faEye}/>
                                </button>
                            </td>
                            <td className="table-icon">
                                <button className="edit-button" onClick={() => handleOpenClientModal("edit", client)}>
                                    <span>Editar</span> <FontAwesomeIcon icon={faPen}/>
                                </button>
                            </td>
                            <td className="table-icon">
                                <button className="del-button">
                                    <span>Excluir</span> <FontAwesomeIcon icon={faTrash}/>
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