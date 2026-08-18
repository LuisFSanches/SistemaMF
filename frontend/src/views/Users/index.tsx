import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { Container } from "./style";
import { AddButton, PageHeader } from "../../styles/global";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faPen } from "@fortawesome/free-solid-svg-icons";
import { ClientModal } from "../../components/ClientModal";
import { Pagination } from "../../components/Pagination";
import { useClients } from "../../contexts/ClientsContext";
import { IClient } from "../../interfaces/IClient";
import { DataTable, ColumnDef } from "../../components/DataTable";
import { RowActions, IconButton } from "../../components/DataTable/style";

export function UsersPage(){
    const { clients, loadAvailableClients, totalClients } = useClients();
    const navigate = useNavigate();

    const [clientModalModal, setClientModal] = useState(false);
    const [action, setAction] = useState("");
    const [currentClient, setCurrentClient] = useState({
        id: "",
        first_name: "",
        last_name: "",
        phone_number: "",
        country_code: "BR"
    });
    const [page, setPage] = useState(1);
    const [query, setQuery] = useState('');
    const pageSize = 15;

    function handleOpenClientModal(action:string, client: any){
        setClientModal(true)
        setAction(action)
        setCurrentClient(client)
    }
    function handleCloseClientModal(){
        setClientModal(false)
    }

    const handleQueryChange = (text: string) => {
        setQuery(text);
        setPage(1);
    }

    useEffect(() => {
        loadAvailableClients(page, pageSize, query);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page, pageSize, query]);

    const columns: ColumnDef<IClient>[] = [
        {
            key: 'first_name',
            header: 'Nome',
            render: (client) => (
                <span
                    style={{ cursor: 'pointer', color: 'var(--dt-accent)', fontWeight: 700, textDecoration: 'underline' }}
                    onClick={() => navigate(`/backoffice/clientes/${client.id}`)}
                >
                    {client.first_name}
                </span>
            ),
        },
        {
            key: 'last_name',
            header: 'Sobrenome',
            render: (client) => client.last_name,
        },
        {
            key: 'phone',
            header: 'Telefone',
            render: (client) => client.phone_number,
        },
        {
            key: 'actions',
            header: 'Editar',
            render: (client) => (
                <RowActions>
                    <IconButton $tone="edit" title="Editar" onClick={() => handleOpenClientModal("edit", client)}>
                        <FontAwesomeIcon icon={faPen}/>
                    </IconButton>
                </RowActions>
            ),
        },
    ];

    return(
        <Container>
            <PageHeader>
                <h1>Clientes</h1>

                <AddButton onClick={() =>handleOpenClientModal("create", {
                    id: "",
                    first_name: "",
                    last_name: "",
                    phone_number: "",
                    country_code: "BR"
                })}>
                    <FontAwesomeIcon icon={faPlus}/>
                    <p>Novo Cliente</p>
                </AddButton>
            </PageHeader>

            <DataTable
                columns={columns}
                data={clients}
                rowKey={(client) => client.id as string}
                searchPlaceholder="Buscar por cliente"
                searchValue={query}
                onSearchChange={handleQueryChange}
                emptyTitle="Nenhum cliente encontrado"
                emptyDescription="Tente buscar por outro nome."
                footer={
                    <>
                        <span className="dt-count">
                            Mostrando <strong>{clients.length}</strong> de <strong>{totalClients}</strong>
                        </span>
                        <Pagination
                            currentPage={page}
                            total={totalClients}
                            pageSize={pageSize as number}
                            onPageChange={setPage}
                        />
                    </>
                }
            />

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