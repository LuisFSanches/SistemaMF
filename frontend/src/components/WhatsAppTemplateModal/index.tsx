import { useEffect, useState } from 'react';
import Modal from 'react-modal';
import { useForm } from 'react-hook-form';
import { ModalContainer, Form, Input, Label, Select, ErrorMessage } from '../../styles/global';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark, faTrash, faPlus } from '@fortawesome/free-solid-svg-icons';
import { createWhatsAppTemplate, updateWhatsAppTemplate, uploadWhatsAppTemplateHeaderMedia, uploadWhatsAppTemplatePreviewImage } from '../../services/whatsappTemplateService';
import { IWhatsAppTemplate, WhatsAppTemplateVariableType, WhatsAppTemplateHeaderType } from '../../interfaces/whatsappTemplate';
import { Loader } from '../Loader';
import { HelpText, SectionTitle, VariableRow, AddVariableButton, MediaPreview, FieldRow } from './styles';

interface WhatsAppTemplateModalProps {
    isOpen: boolean;
    onRequestClose: () => void;
    onSave: () => void;
    currentTemplate?: IWhatsAppTemplate | null;
    action: 'create' | 'edit';
}

const VARIABLE_TYPE_LABELS: Record<WhatsAppTemplateVariableType, string> = {
    TEXT: 'Texto Fixo',
    STORE_NAME: 'Nome da Loja (automático)',
    COUPON_CODE: 'Código do Cupom (automático)',
    COUPON_DISCOUNT_VALUE: 'Valor do Desconto do Cupom (automático)',
    COUPON_MAX_DISCOUNT: 'Desconto Máximo do Cupom (automático)',
    COUPON_MIN_ORDER_AMOUNT: 'Valor Mínimo do Pedido do Cupom (automático)',
};

export function WhatsAppTemplateModal({
    isOpen,
    onRequestClose,
    onSave,
    currentTemplate,
    action
}: WhatsAppTemplateModalProps) {
    const {
        register,
        handleSubmit,
        setValue,
        watch,
        reset,
        formState: { errors }
    } = useForm<{ name: string; language_code: string; header_media_url?: string; preview_image_url?: string }>({
        defaultValues: { language_code: 'pt_BR' },
    });

    const [showLoader, setShowLoader] = useState(false);
    const [variableTypes, setVariableTypes] = useState<WhatsAppTemplateVariableType[]>([]);
    const [headerType, setHeaderType] = useState<WhatsAppTemplateHeaderType>('NONE');

    const headerMediaUrl = watch('header_media_url');
    const previewImageUrl = watch('preview_image_url');

    useEffect(() => {
        if (isOpen && action === 'edit' && currentTemplate) {
            setValue('name', currentTemplate.name);
            setValue('language_code', currentTemplate.language_code);
            setValue('header_media_url', currentTemplate.header_media_url || undefined);
            setValue('preview_image_url', currentTemplate.preview_image_url || undefined);
            setVariableTypes(currentTemplate.variable_types);
            setHeaderType(currentTemplate.header_type || 'NONE');
        } else if (isOpen && action === 'create') {
            reset({ language_code: 'pt_BR' });
            setVariableTypes([]);
            setHeaderType('NONE');
        }
    }, [isOpen, action, currentTemplate, setValue, reset]);

    const handleAddVariable = () => {
        setVariableTypes((prev) => [...prev, 'TEXT']);
    };

    const handleRemoveVariable = (index: number) => {
        setVariableTypes((prev) => prev.filter((_, i) => i !== index));
    };

    const handleChangeVariableType = (index: number, type: WhatsAppTemplateVariableType) => {
        setVariableTypes((prev) => prev.map((t, i) => (i === index ? type : t)));
    };

    const handleUploadHeaderMedia = async (file: File) => {
        if (!currentTemplate) return;

        setShowLoader(true);
        try {
            const response = await uploadWhatsAppTemplateHeaderMedia(currentTemplate.id, file);
            setValue('header_media_url', response.data.template.header_media_url);
        } catch (error: any) {
            console.error('Failed to upload header media:', error);
            const message = error.response?.data?.message || 'Erro ao enviar arquivo';
            alert(message);
        } finally {
            setShowLoader(false);
        }
    };

    const handleUploadPreviewImage = async (file: File) => {
        if (!currentTemplate) return;

        setShowLoader(true);
        try {
            const response = await uploadWhatsAppTemplatePreviewImage(currentTemplate.id, file);
            setValue('preview_image_url', response.data.template.preview_image_url);
        } catch (error: any) {
            console.error('Failed to upload preview image:', error);
            const message = error.response?.data?.message || 'Erro ao enviar arquivo';
            alert(message);
        } finally {
            setShowLoader(false);
        }
    };

    const onSubmit = async (formData: { name: string; language_code: string; header_media_url?: string; preview_image_url?: string }) => {
        setShowLoader(true);
        try {
            const payload = {
                ...formData,
                variable_types: variableTypes,
                header_type: headerType,
                header_media_url: headerType === 'NONE' ? null : formData.header_media_url,
            };

            if (action === 'create') {
                await createWhatsAppTemplate(payload);
            } else if (action === 'edit' && currentTemplate) {
                await updateWhatsAppTemplate(currentTemplate.id, payload);
            }
            onSave();
            onRequestClose();
        } catch (error: any) {
            console.error('Failed to save template:', error);
            const message = error.response?.data?.message || 'Erro ao salvar template';
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
                    <h2>{action === 'create' ? '📱 Novo Template WhatsApp' : '✏️ Editar Template'}</h2>

                    <SectionTitle>📋 Identificação</SectionTitle>

                    <FieldRow>
                        <div>
                            <Label>Nome Técnico do Template *</Label>
                            {errors.name && <ErrorMessage>{errors.name.message}</ErrorMessage>}
                            <Input
                                type="text"
                                placeholder="Ex: promocao_dia_das_maes"
                                {...register('name', { required: 'Nome é obrigatório' })}
                            />
                        </div>
                        <div>
                            <Label>Idioma *</Label>
                            <Input
                                type="text"
                                placeholder="pt_BR"
                                {...register('language_code', { required: 'Idioma é obrigatório' })}
                            />
                        </div>
                    </FieldRow>
                    <HelpText>💡 Deve ser exatamente o nome do template aprovado no Meta Business Manager</HelpText>

                    <SectionTitle>🖼️ Cabeçalho de Mídia</SectionTitle>

                    <Label>Tipo de Cabeçalho</Label>
                    <Select value={headerType} onChange={(e) => setHeaderType(e.target.value as WhatsAppTemplateHeaderType)}>
                        <option value="NONE">Nenhum (só texto)</option>
                        <option value="IMAGE">Imagem</option>
                        <option value="VIDEO">Vídeo</option>
                        <option value="DOCUMENT">Documento</option>
                    </Select>

                    {headerType !== 'NONE' && (
                        <>
                            {action === 'edit' && currentTemplate ? (
                                <>
                                    <Label>Arquivo de Mídia</Label>
                                    <Input
                                        className='file'
                                        type="file"
                                        accept="image/jpeg,image/png,image/webp,video/mp4,video/3gpp,application/pdf"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) handleUploadHeaderMedia(file);
                                        }}
                                    />
                                    <HelpText>💡 Faça upload do mesmo arquivo usado na aprovação do template no Meta Business Manager</HelpText>
                                </>
                            ) : (
                                <HelpText>💡 Salve o template primeiro para poder enviar o arquivo de mídia</HelpText>
                            )}

                            {headerType === 'IMAGE' && headerMediaUrl && (
                                <>
                                    <Label>Preview do Banner</Label>
                                    <MediaPreview src={headerMediaUrl} alt="Preview da mídia do cabeçalho" />
                                </>
                            )}

                            <Label hidden={headerType === 'IMAGE' && !!headerMediaUrl}>URL Pública da Mídia *</Label>
                            {errors.header_media_url && <ErrorMessage>{errors.header_media_url.message}</ErrorMessage>}
                            <Input
                                type="text"
                                placeholder="https://..."
                                readOnly={action === 'edit'}
                                hidden={headerType === 'IMAGE' && !!headerMediaUrl}
                                {...register('header_media_url', {
                                    required: 'URL da mídia é obrigatória',
                                })}
                            />
                        </>
                    )}

                    <SectionTitle>🔢 Variáveis do Template</SectionTitle>
                    <HelpText>
                        Adicione uma linha para cada variável do template, na mesma ordem em que
                        aparecem no texto ({'{{1}}'}, {'{{2}}'}, ...).
                    </HelpText>

                    {variableTypes.map((type, index) => (
                        <VariableRow key={index}>
                            <span>{`{{${index + 1}}}`}</span>
                            <Select
                                value={type}
                                onChange={(e) => handleChangeVariableType(index, e.target.value as WhatsAppTemplateVariableType)}
                            >
                                {Object.entries(VARIABLE_TYPE_LABELS).map(([value, label]) => (
                                    <option key={value} value={value}>{label}</option>
                                ))}
                            </Select>
                            <button type="button" onClick={() => handleRemoveVariable(index)}>
                                <FontAwesomeIcon icon={faTrash} />
                            </button>
                        </VariableRow>
                    ))}

                    <AddVariableButton type="button" onClick={handleAddVariable}>
                        <FontAwesomeIcon icon={faPlus} /> Adicionar Variável
                    </AddVariableButton>

                    <SectionTitle>🖼️ Preview da Campanha</SectionTitle>

                    {action === 'edit' && currentTemplate ? (
                        <>
                            <Label>Arquivo de Preview</Label>
                            <Input
                                className='file'
                                type="file"
                                accept="image/jpeg,image/png,image/webp"
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) handleUploadPreviewImage(file);
                                }}
                            />
                            <HelpText>💡 Imagem usada apenas para visualização da campanha dentro do sistema</HelpText>
                        </>
                    ) : (
                        <HelpText>💡 Salve o template primeiro para poder enviar a imagem de preview</HelpText>
                    )}

                    {previewImageUrl && (
                        <>
                            <Label>Preview da Campanha</Label>
                            <MediaPreview src={previewImageUrl} alt="Preview da campanha" />
                        </>
                    )}

                    <button type="submit" className="create-button">
                        {action === 'create' ? 'Criar Template' : 'Atualizar Template'}
                    </button>
                </Form>
            </ModalContainer>
        </Modal>
    );
}
