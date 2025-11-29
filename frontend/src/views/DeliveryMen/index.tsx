import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { AddButton, PageHeader } from "../../styles/global";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faPen } from "@fortawesome/free-solid-svg-icons";
import { DeliveryManModal } from "../../components/DeliveryManModal";
import { Pagination } from "../../components/Pagination";
import { listDeliveryMen } from "../../services/deliveryManService";
import { IDeliveryMan } from "../../interfaces/IDeliveryMan";
import { Container } from "./style";

export function DeliveryMenPage() {
    const navigate = useNavigate();
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

    const searchDeliveryMen = (text: string) => {
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
    }

    useEffect(() => {
        loadDeliveryMen();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page, pageSize, query]);

    return (
        <Container>
            <PageHeader>
                <h1>Motoboys</h1>
                <div>
                    <input
                        style={{width: '250px'}}
                        type="text"
                        placeholder="Buscar por Motoboy"
                        onKeyDown={(e: any) => {
                            if (e.key === 'Enter') {
                                searchDeliveryMen(e.target.value);
                            }
                        }}
                    />
                </div>
                <Pagination
                    currentPage={page}
                    total={totalDeliveryMen}
                    pageSize={pageSize as number}
                    onPageChange={setPage}
                />

                <AddButton onClick={() => handleOpenDeliveryManModal("create", {
                    id: "",
                    name: "",
                    phone_number: ""
                })}>
                    <FontAwesomeIcon icon={faPlus}/>
                    <p>Novo Motoboy</p>
                </AddButton>
            </PageHeader>
            
            <table>
                <thead className="head">
                    <tr>
                        <th>Nome</th>
                        <th>Telefone</th>
                        <th>Editar</th>
                    </tr>
                </thead>
                <tbody>
                    {deliveryMen?.map(deliveryMan => (
                        <tr key={deliveryMan.id}>
                            <td 
                                style={{ cursor: 'pointer', color: '#EC4899', fontWeight: '600' }}
                                onClick={() => navigate(`/backoffice/motoboy/${deliveryMan.id}`)}
                            >
                                {deliveryMan.name}
                            </td>
                            <td>{deliveryMan.phone_number}</td>
                            <td className="table-icon">
                                <button className="edit-button" onClick={() => handleOpenDeliveryManModal("edit", deliveryMan)}>
                                    <FontAwesomeIcon icon={faPen}/>
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
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
