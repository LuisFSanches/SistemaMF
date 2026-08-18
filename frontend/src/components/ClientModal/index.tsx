import { useEffect, useState } from "react";
import Modal from 'react-modal';
import { useForm } from "react-hook-form";
import { ModalContainer, Form, Input, ErrorMessage } from '../../styles/global';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { createClient, updateClient } from "../../services/clientService";
import { useClients } from "../../contexts/ClientsContext";
import { Loader } from "../../components/Loader";
import { PhoneInput } from "../PhoneInput";

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
    country_code: string;
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
        reset,
        setValue,
        control,
        formState: { errors },
    } = useForm<IUsers>({
        defaultValues: {
            country_code: "BR"
        }
    });
    const [showLoader, setShowLoader] = useState(false);

    const handleUser = async (formData: IUsers) => {
        const data = {
            ...formData,
            phone_number: formData.phone_number.replace(/[^0-9]/g, "")
        }
        setShowLoader(true);

        if (action === "create") {
            const { data: clientData } = await createClient(data);
            addClient(clientData);
            loadAvailableClients(1, 15, '');
            onRequestClose();
        } else if (action === "edit") {
            const { data: clientData } = await updateClient({
                id: currentClient.id,
                ...data
            });

            editClient(clientData);
            loadAvailableClients(1, 15, '');
            onRequestClose();
        }

        setShowLoader(false);
    }

    useEffect(() => {
        if (isOpen) {
            reset({
                first_name: currentClient.first_name || "",
                last_name: currentClient.last_name || "",
                phone_number: currentClient.phone_number || "",
                country_code: currentClient.country_code || "BR"
            });
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen, reset]);

    if (!currentClient) {
		return null;
	}

    return(
        <Modal 
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            overlayClassName="react-modal-overlay"
            className="react-modal-content"
        >
            <Loader show={showLoader} />
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
                    <PhoneInput
                        control={control}
                        setValue={setValue}
                        phoneFieldName="phone_number"
                        countryFieldName="country_code"
                        required
                    />
                    <button type="submit" className="create-button">
                        {action === "create" ? "Criar" : "Editar"}
                    </button>
                </Form>
            </ModalContainer>
        </Modal>
    )
}
