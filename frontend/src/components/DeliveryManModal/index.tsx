import { useEffect, useState } from "react";
import Modal from 'react-modal';
import { useForm } from "react-hook-form";
import InputMask from "react-input-mask";
import { ModalContainer, Form, Input, ErrorMessage } from '../../styles/global';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { createDeliveryMan, updateDeliveryMan } from "../../services/deliveryManService";
import { Loader } from "../../components/Loader";
import { IDeliveryMan } from "../../interfaces/IDeliveryMan";

interface DeliveryManModalProps {
    isOpen: boolean;
    onRequestClose: () => void;
    loadData: () => void;
    action: string;
    currentDeliveryMan: IDeliveryMan;
}

export function DeliveryManModal({
    isOpen,
    onRequestClose,
    loadData,
    action,
    currentDeliveryMan
}: DeliveryManModalProps) {
    const [mask, setMask] = useState("(99) 99999-9999");
    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm<IDeliveryMan>();
    const [showLoader, setShowLoader] = useState(false);

    const handleDeliveryMan = async (formData: IDeliveryMan) => {
        const data = {
            ...formData,
            phone_number: formData.phone_number.replace(/[^0-9]/g, "")
        }
        setShowLoader(true);

        try {
            if (action === "create") {
                await createDeliveryMan(data);
                loadData();
                onRequestClose();
            } else if (action === "edit") {
                await updateDeliveryMan({
                    id: currentDeliveryMan.id,
                    ...data
                });
                loadData();
                onRequestClose();
            }
        } catch (error) {
            console.error("Erro ao salvar motoboy:", error);
        } finally {
            setShowLoader(false);
        }
    }

    useEffect(() => {
        setValue("name", currentDeliveryMan.name);
        setValue("phone_number", currentDeliveryMan.phone_number);
    }, [currentDeliveryMan, setValue]);

    const watchPhone = watch("phone_number");

    useEffect(() => {
        const phoneNumber = watch("phone_number") || "";
        const numericValue = phoneNumber.replace(/[^0-9]/g, "");
    
        const timeout = setTimeout(() => {
            if (numericValue.length === 10) {
                setMask("(99) 9999-9999");
            } else {
                setMask("(99) 99999-9999");
            }
        }, 1000);

        return () => clearTimeout(timeout);
    }, [watchPhone, watch, setMask]);

    if (!currentDeliveryMan) {
        return null;
    }

    return (
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
                <Form onSubmit={handleSubmit(handleDeliveryMan)}>
                    <h2>{action === "create" ? "Novo" : "Editar"} motoboy</h2>
                    {errors.name && <ErrorMessage>{errors.name.message}</ErrorMessage>}
                    <Input placeholder='Nome completo' {...register("name", {required: "Nome inválido"})}/>
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
