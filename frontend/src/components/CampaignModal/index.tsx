import { useEffect, useState } from 'react';
import Modal from 'react-modal';
import { useForm } from 'react-hook-form';
import { ModalContainer, Form, Input, Label, Select, ErrorMessage } from '../../styles/global';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { createCampaign } from '../../services/campaignService';
import { listSegments } from '../../services/segmentService';
import { listWhatsAppTemplates } from '../../services/whatsappTemplateService';
import { listCoupons } from '../../services/couponService';
import { ISegment } from '../../interfaces/segment';
import { IWhatsAppTemplate, WhatsAppTemplateVariableType } from '../../interfaces/whatsappTemplate';
import { ICoupon } from '../../interfaces/coupon';
import { Loader } from '../Loader';
import { HelpText, SectionTitle, VariableField, AutoVariableBox, TemplateCarousel, TemplateCard, TemplateCardImage, TemplateCardName } from './styles';

const COUPON_DEPENDENT_TYPES: WhatsAppTemplateVariableType[] = [
    'COUPON_CODE',
    'COUPON_DISCOUNT_VALUE',
    'COUPON_MAX_DISCOUNT',
    'COUPON_MIN_ORDER_AMOUNT',
];

function formatDiscount(coupon: ICoupon): string {
    const value = Number(coupon.discount_value);
    return coupon.discount_type === 'PERCENTAGE' ? `${value}%` : `R$ ${value.toFixed(2).replace('.', ',')}`;
}

function formatMoney(value: number): string {
    return `R$ ${value.toFixed(2).replace('.', ',')}`;
}

interface CampaignModalProps {
    isOpen: boolean;
    onRequestClose: () => void;
    onSave: () => void;
}

export function CampaignModal({ isOpen, onRequestClose, onSave }: CampaignModalProps) {
    const {
        register,
        handleSubmit,
        watch,
        setValue,
        reset,
        formState: { errors }
    } = useForm<{ name: string; segment_id: string; template_id: string; coupon_id?: string }>();

    const [showLoader, setShowLoader] = useState(false);
    const [segments, setSegments] = useState<ISegment[]>([]);
    const [templates, setTemplates] = useState<IWhatsAppTemplate[]>([]);
    const [coupons, setCoupons] = useState<ICoupon[]>([]);
    const [variableValues, setVariableValues] = useState<string[]>([]);

    const templateId = watch('template_id');
    const couponId = watch('coupon_id');
    const selectedTemplate = templates.find((t) => t.id === templateId);
    const selectedCoupon = coupons.find((c) => c.id === couponId);
    const requiresCoupon = selectedTemplate?.variable_types.some((type) => COUPON_DEPENDENT_TYPES.includes(type)) ?? false;
    const requiresMaxDiscount = selectedTemplate?.variable_types.includes('COUPON_MAX_DISCOUNT') ?? false;
    const requiresMinOrderAmount = selectedTemplate?.variable_types.includes('COUPON_MIN_ORDER_AMOUNT') ?? false;

    useEffect(() => {
        if (!isOpen) return;
        listSegments(1, 100).then((res) => setSegments(res.data.segments || [])).catch(() => {});
        listWhatsAppTemplates().then((res) => setTemplates(res.data.templates || [])).catch(() => {});
        listCoupons(1, 100).then((res) => setCoupons(res.data.coupons || [])).catch(() => {});
    }, [isOpen]);

    useEffect(() => {
        if (isOpen) {
            reset({});
            setVariableValues([]);
        }
    }, [isOpen, reset]);

    useEffect(() => {
        if (selectedTemplate) {
            setVariableValues(new Array(selectedTemplate.variable_count).fill(''));
        } else {
            setVariableValues([]);
        }
    }, [selectedTemplate]);

    const handleChangeVariableValue = (index: number, value: string) => {
        setVariableValues((prev) => prev.map((v, i) => (i === index ? value : v)));
    };

    const onSubmit = async (formData: { name: string; segment_id: string; template_id: string; coupon_id?: string }) => {
        if (!selectedTemplate) return;

        setShowLoader(true);
        try {
            const payload = {
                name: formData.name,
                segment_id: formData.segment_id,
                template_id: formData.template_id,
                coupon_id: formData.coupon_id || undefined,
                variable_values: selectedTemplate.variable_types.map((type, index) =>
                    type === 'TEXT' ? variableValues[index] : null
                ),
            };

            await createCampaign(payload);
            onSave();
            onRequestClose();
        } catch (error: any) {
            console.error('Failed to save campaign:', error);
            const message = error.response?.data?.message || 'Erro ao criar campanha';
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
                    <h2>📢 Nova Campanha</h2>

                    <SectionTitle>📋 Identificação</SectionTitle>

                    <Label>Nome da Campanha *</Label>
                    {errors.name && <ErrorMessage>{errors.name.message}</ErrorMessage>}
                    <Input
                        type="text"
                        placeholder="Ex: Promoção Dia das Mães 2027"
                        {...register('name', { required: 'Nome é obrigatório' })}
                    />

                    <Label>Segmento de Clientes *</Label>
                    {errors.segment_id && <ErrorMessage>{errors.segment_id.message}</ErrorMessage>}
                    <Select {...register('segment_id', { required: 'Segmento é obrigatório' })}>
                        <option value="">Selecione...</option>
                        {segments.map((segment) => (
                            <option key={segment.id} value={segment.id}>{segment.name}</option>
                        ))}
                    </Select>

                    <Label>Template do WhatsApp *</Label>
                    {errors.template_id && <ErrorMessage>{errors.template_id.message}</ErrorMessage>}
                    <input type="hidden" {...register('template_id', { required: 'Template é obrigatório' })} />
                    <TemplateCarousel>
                        {templates.map((template) => (
                            <TemplateCard
                                key={template.id}
                                type="button"
                                selected={template.id === templateId}
                                onClick={() => setValue('template_id', template.id, { shouldValidate: true })}
                            >
                                <TemplateCardImage>
                                    {template.preview_image_url ? (
                                        <img src={template.preview_image_url} alt={template.name} />
                                    ) : (
                                        <span>📱</span>
                                    )}
                                </TemplateCardImage>
                                <TemplateCardName>{template.name}</TemplateCardName>
                            </TemplateCard>
                        ))}
                    </TemplateCarousel>

                    {selectedTemplate && selectedTemplate.variable_count > 0 && (
                        <>
                            <SectionTitle>🔢 Variáveis do Template</SectionTitle>
                            {selectedTemplate.variable_types.map((type, index) => (
                                <VariableField key={index}>
                                    <label>{`{{${index + 1}}}`}</label>
                                    {type === 'TEXT' && (
                                        <Input
                                            type="text"
                                            value={variableValues[index] || ''}
                                            onChange={(e) => handleChangeVariableValue(index, e.target.value)}
                                        />
                                    )}
                                    {type === 'STORE_NAME' && (
                                        <AutoVariableBox>
                                            🏪 Preenchido automaticamente com o nome da loja do pedido do cliente
                                        </AutoVariableBox>
                                    )}
                                    {type === 'COUPON_CODE' && (
                                        <AutoVariableBox>
                                            🎟️ Preenchido automaticamente com o código do cupom selecionado abaixo
                                        </AutoVariableBox>
                                    )}
                                    {type === 'COUPON_DISCOUNT_VALUE' && (
                                        <AutoVariableBox>
                                            💰 Preenchido automaticamente com o valor do desconto do cupom
                                            {selectedCoupon ? ` (${formatDiscount(selectedCoupon)})` : ''}
                                        </AutoVariableBox>
                                    )}
                                    {type === 'COUPON_MAX_DISCOUNT' && (
                                        <AutoVariableBox>
                                            💰 Preenchido automaticamente com o desconto máximo do cupom
                                            {selectedCoupon?.max_discount_amount != null
                                                ? ` (${formatMoney(Number(selectedCoupon.max_discount_amount))})`
                                                : ''}
                                        </AutoVariableBox>
                                    )}
                                    {type === 'COUPON_MIN_ORDER_AMOUNT' && (
                                        <AutoVariableBox>
                                            💰 Preenchido automaticamente com o valor mínimo do pedido do cupom
                                            {selectedCoupon?.minimum_order_amount != null
                                                ? ` (${formatMoney(Number(selectedCoupon.minimum_order_amount))})`
                                                : ''}
                                        </AutoVariableBox>
                                    )}
                                </VariableField>
                            ))}
                        </>
                    )}

                    {requiresCoupon && (
                        <>
                            <Label>Cupom Vinculado *</Label>
                            {errors.coupon_id && <ErrorMessage>{errors.coupon_id.message}</ErrorMessage>}
                            <Select {...register('coupon_id', { required: requiresCoupon ? 'Cupom é obrigatório para este template' : false })}>
                                <option value="">Selecione...</option>
                                {coupons.map((coupon) => (
                                    <option key={coupon.id} value={coupon.id}>{coupon.code}</option>
                                ))}
                            </Select>
                            <HelpText>O código deste cupom será usado para preencher a(s) variável(is) de cupom.</HelpText>
                            {selectedCoupon && requiresMaxDiscount && selectedCoupon.max_discount_amount == null && (
                                <ErrorMessage>Este cupom não possui desconto máximo definido, exigido por este template.</ErrorMessage>
                            )}
                            {selectedCoupon && requiresMinOrderAmount && selectedCoupon.minimum_order_amount == null && (
                                <ErrorMessage>Este cupom não possui valor mínimo de pedido definido, exigido por este template.</ErrorMessage>
                            )}
                        </>
                    )}

                    <button type="submit" className="create-button">
                        Criar Campanha
                    </button>
                </Form>
            </ModalContainer>
        </Modal>
    );
}
