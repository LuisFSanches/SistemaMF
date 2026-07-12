import { useEffect, useState } from 'react';
import Modal from 'react-modal';
import { useForm } from 'react-hook-form';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { ModalContainer, Form, Label, Input, Textarea, ErrorMessage } from '../../styles/global';
import {
    ModalContent,
    FormGrid,
    FullWidthField,
    CycleSelector,
    CycleOption,
    ButtonGroup
} from './style';
import { ISubscriptionPlan } from '../../interfaces/ISubscription';
import { createPlan, updatePlan } from '../../services/subscriptionService';

interface PlanModalProps {
    isOpen: boolean;
    onRequestClose: () => void;
    action: 'create' | 'edit';
    plan: ISubscriptionPlan | null;
    onSuccess: () => void;
}

interface PlanFormData {
    name: string;
    description: string;
    price: string;
    billing_cycle: 'MONTHLY' | 'ANNUAL';
}

export function PlanModal({
    isOpen,
    onRequestClose,
    action,
    plan,
    onSuccess
}: PlanModalProps) {
    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
        reset
    } = useForm<PlanFormData>({
        defaultValues: {
            billing_cycle: 'MONTHLY'
        }
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const selectedCycle = watch('billing_cycle');

    useEffect(() => {
        if (isOpen) {
            if (action === 'edit' && plan) {
                reset({
                    name: plan.name,
                    description: plan.description,
                    price: plan.price.toString(),
                    billing_cycle: plan.billing_cycle
                });
            } else {
                reset({
                    name: '',
                    description: '',
                    price: '',
                    billing_cycle: 'MONTHLY'
                });
            }
        }
    }, [isOpen, action, plan, reset]);

    const onSubmit = async (data: PlanFormData) => {
        setIsSubmitting(true);

        try {
            const planData = {
                name: data.name,
                description: data.description,
                price: parseFloat(data.price),
                billing_cycle: data.billing_cycle,
                is_active: true
            };

            if (action === 'create') {
                await createPlan(planData);
                alert('Plano criado com sucesso!');
            } else if (plan) {
                await updatePlan(plan.id, planData);
                alert('Plano atualizado com sucesso!');
            }

            onSuccess();
            onRequestClose();
        } catch (error: any) {
            console.error('Erro ao salvar plano:', error);
            alert(error?.response?.data?.message || 'Erro ao salvar plano. Tente novamente.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        if (!isSubmitting) {
            onRequestClose();
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={handleClose}
            overlayClassName="react-modal-overlay"
            className="react-modal-content"
        >
            <button
                type="button"
                onClick={handleClose}
                className="modal-close"
                disabled={isSubmitting}
            >
                <FontAwesomeIcon icon={faXmark} />
            </button>

            <ModalContainer>
                <ModalContent>
                    <h2>{action === 'create' ? 'Criar Novo Plano' : 'Editar Plano'}</h2>

                    <Form onSubmit={handleSubmit(onSubmit)}>
                        <FormGrid>
                            <FullWidthField>
                                <Label>
                                    Nome do Plano<span>*</span>
                                </Label>
                                <Input
                                    type="text"
                                    placeholder="Ex: Plano Mensal"
                                    {...register('name', {
                                        required: 'Nome é obrigatório'
                                    })}
                                />
                                {errors.name && (
                                    <ErrorMessage>{errors.name.message}</ErrorMessage>
                                )}
                            </FullWidthField>

                            <FullWidthField>
                                <Label>
                                    Descrição<span>*</span>
                                </Label>
                                <Textarea
                                    placeholder="Descreva os benefícios deste plano"
                                    rows={3}
                                    {...register('description', {
                                        required: 'Descrição é obrigatória'
                                    })}
                                />
                                {errors.description && (
                                    <ErrorMessage>{errors.description.message}</ErrorMessage>
                                )}
                            </FullWidthField>

                            <div>
                                <Label>
                                    Preço (R$)<span>*</span>
                                </Label>
                                <Input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    placeholder="80.00"
                                    {...register('price', {
                                        required: 'Preço é obrigatório',
                                        min: {
                                            value: 0,
                                            message: 'Preço deve ser positivo'
                                        }
                                    })}
                                />
                                {errors.price && (
                                    <ErrorMessage>{errors.price.message}</ErrorMessage>
                                )}
                            </div>
                        </FormGrid>

                        <Label style={{ marginTop: '1rem' }}>
                            Ciclo de Cobrança<span>*</span>
                        </Label>
                        <CycleSelector>
                            <CycleOption selected={selectedCycle === 'MONTHLY'}>
                                <input
                                    type="radio"
                                    value="MONTHLY"
                                    {...register('billing_cycle', {
                                        required: 'Selecione o ciclo de cobrança'
                                    })}
                                />
                                <div className="cycle-info">
                                    <h4>Mensal</h4>
                                    <p>Cobrança todo mês</p>
                                </div>
                            </CycleOption>

                            <CycleOption selected={selectedCycle === 'ANNUAL'}>
                                <input
                                    type="radio"
                                    value="ANNUAL"
                                    {...register('billing_cycle', {
                                        required: 'Selecione o ciclo de cobrança'
                                    })}
                                />
                                <div className="cycle-info">
                                    <h4>Anual</h4>
                                    <p>Cobrança todo ano</p>
                                </div>
                            </CycleOption>
                        </CycleSelector>
                        {errors.billing_cycle && (
                            <ErrorMessage>{errors.billing_cycle.message}</ErrorMessage>
                        )}

                        <ButtonGroup>
                            <button
                                type="button"
                                className="cancel"
                                onClick={handleClose}
                                disabled={isSubmitting}
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                className="submit"
                                disabled={isSubmitting}
                            >
                                {isSubmitting
                                    ? 'Salvando...'
                                    : action === 'create'
                                    ? 'Criar Plano'
                                    : 'Salvar Alterações'}
                            </button>
                        </ButtonGroup>
                    </Form>
                </ModalContent>
            </ModalContainer>
        </Modal>
    );
}
