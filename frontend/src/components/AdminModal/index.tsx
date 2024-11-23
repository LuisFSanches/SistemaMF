import { useEffect, useState } from "react";
import Modal from 'react-modal';
import { useForm } from "react-hook-form";
import { ModalContainer, Form, Input, ErrorMessage, Label, CheckboxContainer, Checkbox } from '../../styles/global';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { createClient, updateClient } from "../../services/clientService";
import { useClients } from "../../contexts/ClientsContext";
import { IAdmin } from "../../interfaces/IAdmin";

interface AdminModalProps{
    isOpen: boolean;
    onRequestClose: ()=> void;
    loadData: () => void;
    action: string;
    currentAdmin: IAdmin;
}

export function AdminModal({
    isOpen,
    onRequestClose,
    loadData,
    action,
    currentAdmin
}:AdminModalProps){
    const { loadAvailableClients, editClient, addClient } = useClients();
    const [ changePassword, setChangePassword ] = useState(false);

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm<IAdmin>();

	const handleAdmin = async () => {

	}

    useEffect(() => {
        setValue("name", currentAdmin.name);
        setValue("username", currentAdmin.username);
    }, [currentAdmin]);

	if (!currentAdmin) {
		return null;
	}

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
                <Form onSubmit={handleSubmit(handleAdmin)}>
                    <h2>{action === "create" ? "Novo" : "Editar"} Administrador</h2>
                    {errors.name && <ErrorMessage>{errors.name.message}</ErrorMessage>}
                    <Input placeholder='Nome' {...register("name", {required: "Nome inválido"})}/>
                    {errors.username && <ErrorMessage>{errors.username.message}</ErrorMessage>}
                    <Input placeholder='Usuário' {...register("username", { required: "Usuário inválido" })}/>

                    {action === "edit" &&
                        <CheckboxContainer>
                            <Checkbox type="checkbox" checked={changePassword}
                                onChange={() => setChangePassword(!changePassword)}
                            />
                            <Label>Alterar senha</Label>
                        </CheckboxContainer>
                    }

                    {(action === "create" || changePassword) &&
                        <>
                            <Input placeholder='Senha' {...register("password", { required: "Senha inválida" })}/>
                            {errors.password && <ErrorMessage>{errors.password.message}</ErrorMessage>}
                            <Input placeholder="Sua senha de confirmação" {...register("password_confirmation", { required: "Confirmação de senha inválida" })}/>
                        </>
                    }

                    <button type="submit" className="create-button">
                        {action === "create" ? "Criar" : "Editar"}
                    </button>
                </Form>
            </ModalContainer>
        </Modal>
    )
}
