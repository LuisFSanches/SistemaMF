import { useEffect } from "react";
import Modal from "react-modal";
import { useForm } from "react-hook-form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { ModalContainer, Form, Input, Label, ErrorMessage, PrimaryButton } from "../../styles/global";
import { IProductColor } from "../../interfaces/IProductVariant";
import { ColorPickerRow, MixedOption } from "./style";

interface ProductColorModalProps {
    isOpen: boolean;
    onRequestClose: () => void;
    onSave: (data: IProductColorForm) => Promise<void>;
    currentColor?: IProductColor | null;
}

export interface IProductColorForm {
    name: string;
    hex: string;
    is_mixed: boolean;
    sort_order: number;
}

export function ProductColorModal({ isOpen, onRequestClose, onSave, currentColor }: ProductColorModalProps) {
    const { register, handleSubmit, watch, reset, formState: { errors, isSubmitting } } = useForm<IProductColorForm>();
    const isMixed = watch("is_mixed");

    useEffect(() => {
        if (isOpen) {
            reset({
                name: currentColor?.name || "",
                hex: currentColor?.hex || "#C62828",
                is_mixed: currentColor?.is_mixed || false,
                sort_order: currentColor?.sort_order ?? 0,
            });
        }
    }, [isOpen, currentColor, reset]);

    const handleSave = async (data: IProductColorForm) => {
        await onSave({ ...data, sort_order: Number(data.sort_order) || 0 });
    };

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
                <h2>{currentColor ? "Editar Cor" : "Nova Cor"}</h2>
                <Form onSubmit={handleSubmit(handleSave)}>
                    <Label>
                        Nome *
                        <Input
                            type="text"
                            placeholder="Ex: Vermelho, Chá, Sortido"
                            {...register("name", { required: "Nome é obrigatório" })}
                        />
                        {errors.name && <ErrorMessage>{errors.name.message}</ErrorMessage>}
                    </Label>

                    <MixedOption>
                        <input type="checkbox" {...register("is_mixed")} />
                        Cor mista (sortido / colorido / variado)
                    </MixedOption>

                    {!isMixed && (
                        <Label>
                            Cor de exibição
                            <ColorPickerRow>
                                <Input type="color" {...register("hex")} />
                                <span>{watch("hex")}</span>
                            </ColorPickerRow>
                        </Label>
                    )}

                    <Label>
                        Ordem de exibição
                        <Input type="number" {...register("sort_order")} />
                    </Label>

                    <PrimaryButton type="submit" disabled={isSubmitting}>
                        {isSubmitting ? "Salvando..." : currentColor ? "Atualizar Cor" : "Criar Cor"}
                    </PrimaryButton>
                </Form>
            </ModalContainer>
        </Modal>
    );
}
