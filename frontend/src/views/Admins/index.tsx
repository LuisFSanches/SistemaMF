import { useState } from "react";

import { Container } from "./style";
import { AddButton, PageHeader } from "../../styles/global";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash, faEye, faPlus, faPen } from "@fortawesome/free-solid-svg-icons";
import { useAdmins } from "../../contexts/AdminsContext";
import { AdminModal } from "../../components/AdminModal";

export function AdminsPage(){
    const { admins } = useAdmins();

    const [adminModal, setAdminModal] = useState(false);
    const [action, setAction] = useState("");
    const [currentAdmin, setCurrentAdmin] = useState({
        id: "",
        name: "",
        username: "",
        password: "",
    });

    function handleOpenAdminModal(action:string, client: any){
        setAdminModal(true)
        setAction(action)
        setCurrentAdmin(client)
    }
    function handleCloseClientModal(){
        setAdminModal(false)
    }

    return(
        <Container>
            <PageHeader>
                <h1>Administradores</h1>

                <AddButton onClick={() =>handleOpenAdminModal("create", {
                    id: "",
                    name: "",
                    username: "",
                })}>
                    <FontAwesomeIcon icon={faPlus}/>
                    <p>Novo Admin</p>
                </AddButton>
            </PageHeader>
            
            <table>
                <thead className="head">
                    <tr>
                        <th>Nome</th>
                        <th>Usuário</th>
                        <th>Editar</th>
                        <th>Deletar</th>
                    </tr>
                </thead>
                <tbody>
                    {admins?.map(admin => (
                        <tr key={admin.id}>
                            <td>{admin.name}</td>
                            <td>{admin.username}</td>
                            <td className="table-icon">
                                <button className="edit-button" onClick={() => handleOpenAdminModal("edit", admin)}>
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
            <AdminModal
                isOpen={adminModal}
                onRequestClose={handleCloseClientModal}
                loadData={() => {}}
                action={action}
                currentAdmin={currentAdmin}
            />
        </Container>
    )
}
