import { useEffect, useContext } from "react";
import Modal from 'react-modal';
import { set, useForm } from "react-hook-form";
import { ModalContainer, Form, Input } from '../../styles/global';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { createClient, updateClient } from "../../services/clientService";
import { useClients } from "../../contexts/ClientsContext";

interface ClientModalProps{
    isOpen: boolean;
    onRequestClose: ()=> void;
    loadData: () => void;
    action: string;
    currentClient: IUsers;
}

interface IUsers {
    id?: string;
    first_name: string;
    last_name: string;
    phone_number: string;
}

export function ClientModal({
    isOpen,
    onRequestClose,
    loadData,
    action,
    currentClient
}:ClientModalProps){
    const { loadAvailableClients, editClient, addClient } = useClients();

    const {
        register,
        handleSubmit,
        setValue,
        setError,
        reset,
        formState: { errors },
    } = useForm<IUsers>();

    const handleUser = async (data: IUsers) => {
        if (action === "create") {
            const { data: clientData } = await createClient(data);
            addClient(clientData);
            loadAvailableClients();
            onRequestClose();
        } else if (action === "edit") {
            const { data: clientData } = await updateClient({
                id: currentClient.id,
                ...data
            });
            editClient(clientData.client);
            loadAvailableClients();
            onRequestClose();
        }
    }

    useEffect(() => {
        setValue("first_name", currentClient.first_name);
        setValue("last_name", currentClient.last_name);
        setValue("phone_number", currentClient.phone_number);
    }, [currentClient]);

    return(
        <Modal 
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            overlayClassName="react-modal-overlay"
            className="react-modal-content"
        >
            <button type="button" onClick={onRequestClose} className="modal-close">
                <FontAwesomeIcon icon={faXmark}/>
            </button>

            <ModalContainer>
                <Form onSubmit={handleSubmit(handleUser)}>
                    <h2>{action === "create" ? "Novo" : "Editar"} cliente</h2>
                    <Input placeholder='Nome' {...register("first_name")}/>
                    <Input placeholder='Sobrenome' {...register("last_name")}/>
                    <Input placeholder='Telefone' {...register("phone_number")}/>
                    <button type="submit" className="create-button">
                        {action === "create" ? "Criar" : "Editar"}
                    </button>
                </Form>
            </ModalContainer>
        </Modal>
    )
}
