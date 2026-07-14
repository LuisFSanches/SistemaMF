import { useEffect, useState } from 'react';
import Modal from 'react-modal';
import { useForm } from 'react-hook-form';
import { ModalContainer, Form, Input, Label, Select, ErrorMessage, CheckboxContainer, Checkbox } from '../../styles/global';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { createCoupon, updateCoupon } from '../../services/couponService';
import { ICoupon, ICreateCouponData } from '../../interfaces/coupon';
import { Loader } from '../Loader';
import { FormRow, HelpText, SectionTitle } from './styles';

interface CouponModalProps {
    isOpen: boolean;
    onRequestClose: () => void;
    onSave: () => void;
    currentCoupon?: ICoupon | null;
    action: 'create' | 'edit';
}

export function CouponModal({
    isOpen,
    onRequestClose,
    onSave,
    currentCoupon,
    action
}: CouponModalProps) {
    const {
        register,
        handleSubmit,
        watch,
        setValue,
        reset,
        formState: { errors }
    } = useForm<ICreateCouponData>({
        defaultValues: {
            is_active: true,
            discount_type: 'FIXED'
        }
    });

    const [showLoader, setShowLoader] = useState(false);
    const [neverExpires, setNeverExpires] = useState(false);
    const discountType = watch('discount_type');

    useEffect(() => {
        if (discountType === 'FIXED') {
            setValue('max_discount_amount', undefined);
        }
    }, [discountType, setValue]);

    useEffect(() => {
        if (isOpen && action === 'edit' && currentCoupon) {
            setValue('code', currentCoupon.code);
            setValue('is_active', currentCoupon.is_active);
            setValue('discount_type', currentCoupon.discount_type);
            setValue('discount_value', Number(currentCoupon.discount_value));
            setValue('max_discount_amount', currentCoupon.max_discount_amount ? Number(currentCoupon.max_discount_amount) : undefined);
            
            const startDate = new Date(currentCoupon.start_date);
            const expirationDate = new Date(currentCoupon.expiration_date);
            setValue('start_date', startDate.toISOString().split('T')[0] as any);
            setValue('expiration_date', expirationDate.toISOString().split('T')[0] as any);
            
            setNeverExpires(expirationDate.getFullYear() >= 2099);
            
            setValue('total_usage_limit', currentCoupon.total_usage_limit || undefined);
            setValue('usage_limit_per_customer', currentCoupon.usage_limit_per_customer || undefined);
            setValue('specific_customer_id', currentCoupon.specific_customer_id || undefined);
            setValue('minimum_order_amount', currentCoupon.minimum_order_amount ? Number(currentCoupon.minimum_order_amount) : undefined);
        } else if (isOpen && action === 'create') {
            reset({
                is_active: true,
                discount_type: 'FIXED'
            });
            setNeverExpires(false);
        }
    }, [isOpen, action, currentCoupon, setValue, reset]);

    const onSubmit = async (data: ICreateCouponData) => {
        setShowLoader(true);
        try {
            const payload: ICreateCouponData = {
                ...data,
                discount_value: Number(data.discount_value),
                max_discount_amount: data.max_discount_amount ? Number(data.max_discount_amount) : null,
                total_usage_limit: data.total_usage_limit ? Number(data.total_usage_limit) : null,
                usage_limit_per_customer: data.usage_limit_per_customer ? Number(data.usage_limit_per_customer) : null,
                minimum_order_amount: data.minimum_order_amount ? Number(data.minimum_order_amount) : null,
                expiration_date: neverExpires ? new Date('2099-12-31') : data.expiration_date
            };

            if (action === 'create') {
                await createCoupon(payload);
            } else if (action === 'edit' && currentCoupon) {
                await updateCoupon(currentCoupon.id, payload);
            }
            onSave();
            onRequestClose();
        } catch (error: any) {
            console.error('Failed to save coupon:', error);
            const message = error.response?.data?.message || 'Erro ao salvar cupom';
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
                    <h2>{action === 'create' ? '🎁 Criar Novo Cupom' : '✏️ Editar Cupom'}</h2>

                    <SectionTitle>📋 Identificação</SectionTitle>

                    <Label>Código do Cupom *</Label>
                    {errors.code && <ErrorMessage>{errors.code.message}</ErrorMessage>}
                    <Input
                        type="text"
                        placeholder="Ex: VERAO2026"
                        {...register('code', { required: 'Código é obrigatório' })}
                    />
                    <HelpText>💡 Este código será usado no pedido</HelpText>

                    <CheckboxContainer style={{ marginBottom: '1rem' }}>
                        <Checkbox
                            type="checkbox"
                            id="is_active"
                            {...register('is_active')}
                        />
                        <Label htmlFor="is_active" noMargin>Cupom ativo</Label>
                    </CheckboxContainer>

                    <SectionTitle>💰 Valor do Desconto</SectionTitle>

                    <FormRow>
                        <div>
                            <Label noMargin={false}>Tipo de Desconto *</Label>
                            <Select style={{ height: '64px' }} {...register('discount_type', { required: true })}>
                                <option value="FIXED">💵 Valor Fixo (R$)</option>
                                <option value="PERCENTAGE">% Porcentagem (%)</option>
                            </Select>
                        </div>

                        <div>
                            <Label>Valor do Desconto *</Label>
                            {errors.discount_value && <ErrorMessage>{errors.discount_value.message}</ErrorMessage>}
                            <Input
                                type="number"
                                step="0.01"
                                placeholder={discountType === 'PERCENTAGE' ? '10' : '50.00'}
                                {...register('discount_value', {
                                    required: 'Valor é obrigatório',
                                    min: { value: 0.01, message: 'Valor deve ser maior que 0' }
                                })}
                            />
                            <HelpText>
                                {discountType === 'PERCENTAGE' ? '📊 Insira um valor entre 0 e 100' : '💵 Valor em reais'}
                            </HelpText>
                        </div>
                    </FormRow>

                    {discountType === 'PERCENTAGE' && (
                        <>
                            <Label>Desconto Máximo (R$)</Label>
                            <Input
                                type="number"
                                step="0.01"
                                placeholder="Ex: 100.00"
                                {...register('max_discount_amount')}
                            />
                            <HelpText>🛡️ Limite máximo de desconto (opcional)</HelpText>
                        </>
                    )}

                    <SectionTitle>📅 Período de Validade</SectionTitle>

                    <FormRow>
                        <div>
                            <Label>Data de Início *</Label>
                            {errors.start_date && <ErrorMessage>{errors.start_date.message}</ErrorMessage>}
                            <Input
                                type="date"
                                {...register('start_date', { required: 'Data de início é obrigatória' })}
                            />
                        </div>

                        <div>
                            <Label>Data de Expiração *</Label>
                            {errors.expiration_date && <ErrorMessage>{errors.expiration_date.message}</ErrorMessage>}
                            <Input
                                type="date"
                                disabled={neverExpires}
                                {...register('expiration_date', { 
                                    required: !neverExpires ? 'Data de expiração é obrigatória' : false 
                                })}
                            />
                            <CheckboxContainer style={{ marginTop: '0.5rem' }}>
                                <Checkbox
                                    type="checkbox"
                                    id="never_expires"
                                    checked={neverExpires}
                                    onChange={(e) => setNeverExpires(e.target.checked)}
                                />
                                <Label htmlFor="never_expires" noMargin>Nunca expira</Label>
                            </CheckboxContainer>
                        </div>
                    </FormRow>

                    <SectionTitle>🎯 Limites de Uso</SectionTitle>

                    <FormRow>
                        <div>
                            <Label>Limite Total</Label>
                            <Input
                                type="number"
                                placeholder="Ilimitado"
                                {...register('total_usage_limit')}
                            />
                            <HelpText>🔢 Quantas vezes pode ser usado no total</HelpText>
                        </div>

                        <div style={{ display: 'none' }}>
                            <Label>Limite por Cliente</Label>
                            <Input
                                type="number"
                                placeholder="Ilimitado"
                                {...register('usage_limit_per_customer')}
                            />
                            <HelpText>👤 Vezes que cada cliente pode usar</HelpText>
                        </div>
                        <div>
                            <Label>Valor Mínimo do Pedido (R$)</Label>
                            <Input
                                type="number"
                                step="0.01"
                                placeholder="Sem mínimo"
                                {...register('minimum_order_amount')}
                            />
                            <HelpText>🛒 Valor mínimo do pedido para usar o cupom</HelpText>
                        </div>
                    </FormRow>

                    <button type="submit" className="create-button">
                        {action === 'create' ? 'Criar Cupom' : 'Atualizar Cupom'}
                    </button>
                </Form>
            </ModalContainer>
        </Modal>
    );
}
