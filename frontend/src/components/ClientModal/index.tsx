import { useEffect, useState } from "react";
import Modal from 'react-modal';
import { set, useForm } from "react-hook-form";
import InputMask from "react-input-mask";
import { ModalContainer, Form, Input, ErrorMessage } from '../../styles/global';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { createClient, updateClient } from "../../services/clientService";
import { useClients } from "../../contexts/ClientsContext";
import { clear } from "console";

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
    const [mask, setMask] = useState("(99) 99999-9999");
    const {
        register,
        handleSubmit,
        setValue,
        setError,
        reset,
        watch,
        formState: { errors },
    } = useForm<IUsers>();

    const handleUser = async (formData: IUsers) => {
        const data = {
            ...formData,
            phone_number: formData.phone_number.replace(/[^0-9]/g, "")
        }

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

            editClient(clientData);
            loadAvailableClients();
            onRequestClose();
        }
    }

    useEffect(() => {
        setValue("first_name", currentClient.first_name);
        setValue("last_name", currentClient.last_name);
        setValue("phone_number", currentClient.phone_number);
    }, [currentClient]);

    useEffect(() => {
        const phoneNumber = watch("phone_number") || "";
        const numericValue = phoneNumber.replace(/[^0-9]/g, "");
    
        const timeout = setTimeout(() => {
            if (numericValue.length === 10) {
                setMask("(99) 9999-9999");
            } else {
                setMask("(99) 99999-9999");
            }
            console.log('CHAMOU')
        }, 1000);

        return () => clearTimeout(timeout);
    }, [watch("phone_number")]);

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
                    {errors.first_name && <ErrorMessage>{errors.first_name.message}</ErrorMessage>}
                    <Input placeholder='Nome' {...register("first_name", {required: "Nome inválido"})}/>
                    {errors.last_name && <ErrorMessage>{errors.last_name.message}</ErrorMessage>}
                    <Input placeholder='Sobrenome' {...register("last_name", { required: "Sobrenome inválido" })}/>
                    {errors.phone_number && <ErrorMessage>{errors.phone_number.message}</ErrorMessage>}
                    <InputMask
                        mask={mask}
                        placeholder='Telefone'
                        value={watch("phone_number") || ""}
                        {...register("phone_number", { 
                            required: "Telefone inválido",
                            validate: (value) => {
                                if (value.replace(/[^0-9]/g, "").length < 10) {
                                    return "Telefone inválido";
                                }
                                return true;
                            }
                        })}
                    />
                    <button type="submit" className="create-button">
                        {action === "create" ? "Criar" : "Editar"}
                    </button>
                </Form>
            </ModalContainer>
        </Modal>
    )
}
