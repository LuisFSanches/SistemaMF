import { useEffect, useState } from 'react';
import Modal from 'react-modal';
import { useForm } from 'react-hook-form';
import { ModalContainer, Form, Input, Label, ErrorMessage } from '../../styles/global';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { createSpecialDate, updateSpecialDate } from '../../services/specialDateService';
import { ISpecialDate, ICreateSpecialDateData } from '../../interfaces/specialDate';
import { Loader } from '../Loader';

interface SpecialDateModalProps {
    isOpen: boolean;
    onRequestClose: () => void;
    onSave: () => void;
    currentSpecialDate?: ISpecialDate | null;
    action: 'create' | 'edit';
}

export function SpecialDateModal({
    isOpen,
    onRequestClose,
    onSave,
    currentSpecialDate,
    action
}: SpecialDateModalProps) {
    const {
        register,
        handleSubmit,
        setValue,
        reset,
        formState: { errors }
    } = useForm<ICreateSpecialDateData>();

    const [showLoader, setShowLoader] = useState(false);

    useEffect(() => {
        if (isOpen && action === 'edit' && currentSpecialDate) {
            setValue('name', currentSpecialDate.name);
            const date = new Date(currentSpecialDate.date);
            setValue('date', date.toISOString().split('T')[0] as any);
        } else if (isOpen && action === 'create') {
            reset({});
        }
    }, [isOpen, action, currentSpecialDate, setValue, reset]);

    const onSubmit = async (data: ICreateSpecialDateData) => {
        setShowLoader(true);
        try {
            if (action === 'create') {
                await createSpecialDate(data);
            } else if (action === 'edit' && currentSpecialDate) {
                await updateSpecialDate(currentSpecialDate.id, data);
            }
            onSave();
            onRequestClose();
        } catch (error: any) {
            console.error('Failed to save special date:', error);
            const message = error.response?.data?.message || 'Erro ao salvar data especial';
            alert(message);
        } finally {
            setShowLoader(false);
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            overlayClassName="react-modal-overlay"
            className="react-modal-content-medium"
        >
            <Loader show={showLoader} />
            <button type="button" onClick={onRequestClose} className="modal-close">
                <FontAwesomeIcon icon={faXmark} />
            </button>

            <ModalContainer>
                <Form onSubmit={handleSubmit(onSubmit)}>
                    <h2>{action === 'create' ? '📅 Nova Data Especial' : '✏️ Editar Data Especial'}</h2>

                    <Label>Nome *</Label>
                    {errors.name && <ErrorMessage>{errors.name.message}</ErrorMessage>}
                    <Input
                        type="text"
                        placeholder="Ex: Dia das Mães 2027"
                        {...register('name', { required: 'Nome é obrigatório' })}
                    />

                    <Label>Data *</Label>
                    {errors.date && <ErrorMessage>{errors.date.message}</ErrorMessage>}
                    <Input
                        type="date"
                        {...register('date', { required: 'Data é obrigatória' })}
                    />

                    <button type="submit" className="create-button">
                        {action === 'create' ? 'Criar Data Especial' : 'Atualizar Data Especial'}
                    </button>
                </Form>
            </ModalContainer>
        </Modal>
    );
}
