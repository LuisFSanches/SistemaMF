import { useState, useEffect, useRef } from "react";
import Modal from 'react-modal';
import { useClients } from "../../contexts/ClientsContext";
import { ModalContainer, Form, Input, Label } from '../../styles/global';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { ClientList } from "./style";

interface ChangeClientModalProps {
    isOpen: boolean;
    onRequestClose: () => void;
    onSelectClient: (client: any) => void;
}

export function ChangeClientModal({
    isOpen,
    onRequestClose,
    onSelectClient
}: ChangeClientModalProps) {
    const { clients, loadAvailableClients } = useClients();
    const [searchQuery, setSearchQuery] = useState("");
    const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

    const handleSearch = (text: string) => {
        setSearchQuery(text);

        if (debounceTimeout.current) {
            clearTimeout(debounceTimeout.current);
        }

        debounceTimeout.current = setTimeout(() => {
            loadAvailableClients(1, 15, text);
        }, 700);
    };

    const handleSelectClient = (client: any) => {
        onSelectClient(client);
        onRequestClose();
        setSearchQuery("");
    };

    useEffect(() => {
        if (isOpen) {
            loadAvailableClients(1, 15, "");
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen]);

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            overlayClassName="react-modal-overlay"
            className="react-modal-content"
        >
            <button type="button" onClick={onRequestClose} className="modal-close">
                <FontAwesomeIcon icon={faXmark} />
            </button>

            <ModalContainer>
                <h2>Selecionar Cliente</h2>
                <Form onSubmit={(e) => e.preventDefault()}>
                    <div>
                        <Label>Buscar Cliente</Label>
                        <Input
                            type="text"
                            placeholder="Digite o nome ou telefone do cliente"
                            value={searchQuery}
                            onChange={(e) => handleSearch(e.target.value)}
                        />
                    </div>

                    <ClientList>
                        {clients && clients.length > 0 ? (
                            clients.map((client) => (
                                <li key={client.id} onClick={() => handleSelectClient(client)}>
                                    <div className="client-info">
                                        <span className="client-name">
                                            {client.first_name} {client.last_name}
                                        </span>
                                        <span className="client-phone">{client.phone_number}</span>
                                    </div>
                                </li>
                            ))
                        ) : (
                            <li className="no-results">Nenhum cliente encontrado</li>
                        )}
                    </ClientList>
                </Form>
            </ModalContainer>
        </Modal>
    );
}
