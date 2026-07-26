import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { AddButton, PageHeader } from "../../styles/global";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faPen } from "@fortawesome/free-solid-svg-icons";
import { DeliveryManModal } from "../../components/DeliveryManModal";
import { Pagination } from "../../components/Pagination";
import { listDeliveryMen } from "../../services/deliveryManService";
import { useDeliveryMen } from "../../contexts/DeliveryMenContext";
import { IDeliveryMan } from "../../interfaces/IDeliveryMan";
import { Container } from "./style";
import { DataTable, ColumnDef } from "../../components/DataTable";
import { RowActions, IconButton } from "../../components/DataTable/style";

export function DeliveryMenPage() {
    const navigate = useNavigate();
    const { loadDeliveryMen: refreshDeliveryMenList } = useDeliveryMen();
    const [deliveryMen, setDeliveryMen] = useState<IDeliveryMan[]>([]);
    const [totalDeliveryMen, setTotalDeliveryMen] = useState(0);
    const [deliveryManModal, setDeliveryManModal] = useState(false);
    const [action, setAction] = useState("");
    const [currentDeliveryMan, setCurrentDeliveryMan] = useState<IDeliveryMan>({
        id: "",
        name: "",
        phone_number: ""
    });
    const [page, setPage] = useState(1);
    const [query, setQuery] = useState('');
    const pageSize = 15;

    function handleOpenDeliveryManModal(action: string, deliveryMan: IDeliveryMan) {
        setDeliveryManModal(true)
        setAction(action)
        setCurrentDeliveryMan(deliveryMan)
    }

    function handleCloseDeliveryManModal() {
        setDeliveryManModal(false)
    }

    const handleQueryChange = (text: string) => {
        setQuery(text);
        setPage(1);
    }

    const loadDeliveryMen = async () => {
        try {
            const { data } = await listDeliveryMen(page, pageSize, query);
            setDeliveryMen(data.deliveryMen || []);
            setTotalDeliveryMen(data.total || 0);
        } catch (error) {
            console.error("Erro ao carregar motoboys:", error);
        }
        refreshDeliveryMenList();
    }

    useEffect(() => {
        loadDeliveryMen();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page, pageSize, query]);

    const columns: ColumnDef<IDeliveryMan>[] = [
        {
            key: 'name',
            header: 'Nome',
            render: (deliveryMan) => (
                <span
                    style={{ cursor: 'pointer', color: 'var(--dt-accent)', fontWeight: 700 }}
                    onClick={() => navigate(`/backoffice/motoboy/${deliveryMan.id}`)}
                >
                    {deliveryMan.name}
                </span>
            ),
        },
        {
            key: 'phone',
            header: 'Telefone',
            render: (deliveryMan) => deliveryMan.phone_number,
        },
        {
            key: 'actions',
            header: 'Editar',
            render: (deliveryMan) => (
                <RowActions style={{ justifyContent: 'center' }}>
                    <IconButton $tone="edit" title="Editar" onClick={() => handleOpenDeliveryManModal("edit", deliveryMan)}>
                        <FontAwesomeIcon icon={faPen}/>
                    </IconButton>
                </RowActions>
            ),
        },
    ];

    return (
        <Container>
            <PageHeader>
                <h1>Motoboys</h1>

                <AddButton onClick={() => handleOpenDeliveryManModal("create", {
                    id: "",
                    name: "",
                    phone_number: ""
                })}>
                    <FontAwesomeIcon icon={faPlus}/>
                    <p>Novo Motoboy</p>
                </AddButton>
            </PageHeader>

            <DataTable
                columns={columns}
                data={deliveryMen}
                rowKey={(deliveryMan) => deliveryMan.id as string}
                searchPlaceholder="Buscar por motoboy"
                searchValue={query}
                onSearchChange={handleQueryChange}
                emptyTitle="Nenhum motoboy encontrado"
                emptyDescription="Tente buscar por outro nome."
                footer={
                    <>
                        <span className="dt-count">
                            Mostrando <strong>{deliveryMen.length}</strong> de <strong>{totalDeliveryMen}</strong>
                        </span>
                        <Pagination
                            currentPage={page}
                            total={totalDeliveryMen}
                            pageSize={pageSize as number}
                            onPageChange={setPage}
                        />
                    </>
                }
            />

            <DeliveryManModal
                isOpen={deliveryManModal}
                onRequestClose={handleCloseDeliveryManModal}
                loadData={loadDeliveryMen}
                action={action}
                currentDeliveryMan={currentDeliveryMan}
            />
        </Container>
    )
}
