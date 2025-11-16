import { useState, useEffect } from "react";
import Modal from 'react-modal';
import { useForm } from "react-hook-form";
import { ModalContainer, Form, Input, Label, ErrorMessage } from '../../styles/global';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { createSupplier } from "../../services/supplierService";
import { Loader } from "../../components/Loader";
import { useSuccessMessage } from "../../contexts/SuccessMessageContext";

interface SupplierModalProps {
    isOpen: boolean;
    onRequestClose: () => void;
    loadData: () => void;
}

interface ISupplierForm {
    name: string;
}

export function SupplierModal({
    isOpen,
    onRequestClose,
    loadData,
}: SupplierModalProps) {
    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm<ISupplierForm>();
    const [showLoader, setShowLoader] = useState(false);
    const { showSuccess } = useSuccessMessage();

    const handleCreateSupplier = async (formData: ISupplierForm) => {
        try {
            setShowLoader(true);
            await createSupplier(formData);
            setShowLoader(false);
            showSuccess("Fornecedor cadastrado com sucesso!");
            onRequestClose();
            loadData();
        } catch (error) {
            setShowLoader(false);
            console.error("Erro ao criar fornecedor:", error);
        }
    };

    useEffect(() => {
        setValue("name", "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen]);

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            overlayClassName="react-modal-overlay"
            className="react-modal-content"
        >
            <Loader show={showLoader} />
            <button type="button" onClick={onRequestClose} className="modal-close">
                <FontAwesomeIcon icon={faXmark} />
            </button>

            <ModalContainer>
                <Form onSubmit={handleSubmit(handleCreateSupplier)}>
                    <h2>Novo Fornecedor</h2>
                    
                    <Label>Nome<span>*</span></Label>
                    <Input
                        type="text"
                        placeholder="Nome do fornecedor"
                        {...register("name", { required: "Nome é obrigatório" })}
                    />
                    {errors.name && <ErrorMessage>{errors.name.message}</ErrorMessage>}

                    <button type="submit" className="create-button">
                        Criar
                    </button>
                </Form>
            </ModalContainer>
        </Modal>
    );
}
