import { useState } from "react";

import { Container } from "./style";
import { AddButton, PageHeader } from "../../styles/global";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faPen } from "@fortawesome/free-solid-svg-icons";
import { useAdmins } from "../../contexts/AdminsContext";
import { AdminModal } from "../../components/AdminModal";
import { IAdmin } from "../../interfaces/IAdmin";
import { DataTable, ColumnDef } from "../../components/DataTable";
import { RowActions, IconButton } from "../../components/DataTable/style";
import { Badge } from "../../components/Badge";

export function AdminsPage(){
    const { admins } = useAdmins();

    const [adminModal, setAdminModal] = useState(false);
    const [action, setAction] = useState("");
    const [currentAdmin, setCurrentAdmin] = useState({
        id: "",
        name: "",
        username: "",
        password: "",
        role: ""
    });

    function handleOpenAdminModal(action:string, admin: any){
        setAdminModal(true)
        setAction(action)
        setCurrentAdmin(admin)
    }
    function handleCloseClientModal(){
        setAdminModal(false)
    }

    const columns: ColumnDef<IAdmin>[] = [
        {
            key: 'name',
            header: 'Nome',
            render: (admin) => admin.name,
        },
        {
            key: 'username',
            header: 'Usuário',
            render: (admin) => admin.username,
        },
        {
            key: 'role',
            header: 'Tipo',
            render: (admin) => (
                <Badge tone={admin.role === "SUPER_ADMIN" ? "info" : "neutral"}>
                    {admin.role === "SUPER_ADMIN" ? "Administrador" : "Vendedor"}
                </Badge>
            ),
        },
        {
            key: 'actions',
            header: 'Editar',
            render: (admin) => (
                <RowActions>
                    <IconButton $tone="edit" title="Editar" onClick={() => handleOpenAdminModal("edit", admin)}>
                        <FontAwesomeIcon icon={faPen}/>
                    </IconButton>
                </RowActions>
            ),
        },
    ];

    return(
        <Container>
            <PageHeader>
                <h1>Administradores/Vendedores</h1>

                <AddButton onClick={() =>handleOpenAdminModal("create", {
                    id: "",
                    name: "",
                    username: "",
                    role: ""
                })}>
                    <FontAwesomeIcon icon={faPlus}/>
                    <p>Novo Vendedor/Admin</p>
                </AddButton>
            </PageHeader>

            <DataTable
                columns={columns}
                data={admins}
                rowKey={(admin) => admin.id as string}
                emptyTitle="Nenhum administrador encontrado"
                emptyDescription="Cadastre o primeiro administrador ou vendedor."
            />

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
