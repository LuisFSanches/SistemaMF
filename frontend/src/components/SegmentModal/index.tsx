import { useEffect, useState, useCallback } from 'react';
import Modal from 'react-modal';
import { useForm } from 'react-hook-form';
import { ModalContainer, Form, Input, Label, Select, ErrorMessage, CheckboxContainer, Checkbox } from '../../styles/global';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { createSegment, updateSegment, previewSegmentDraft } from '../../services/segmentService';
import { listSpecialDates } from '../../services/specialDateService';
import { listClients } from '../../services/clientService';
import categoryService from '../../services/categoryService';
import { ICategory } from '../../interfaces/ICategory';
import { ISpecialDate } from '../../interfaces/specialDate';
import {
    ISegment,
    ICreateSegmentData,
    SegmentType,
    IPurchaseRecencyFilter,
    IMinOrderValueFilter,
    IMinOrderCountFilter,
    ISegmentClient,
} from '../../interfaces/segment';
import { Loader } from '../Loader';
import {
    FormRow,
    HelpText,
    SectionTitle,
    TypeTabs,
    TypeTabButton,
    FilterBlock,
    FilterBlockHeader,
    CategoryChecklist,
    CategoryChip,
    ClientSearchResults,
    ClientSearchResultItem,
    SelectedClientsList,
    SelectedClientItem,
    PreviewBox,
} from './styles';

interface SegmentModalProps {
    isOpen: boolean;
    onRequestClose: () => void;
    onSave: () => void;
    currentSegment?: ISegment | null;
    action: 'create' | 'edit';
}

export function SegmentModal({
    isOpen,
    onRequestClose,
    onSave,
    currentSegment,
    action
}: SegmentModalProps) {
    const {
        register,
        handleSubmit,
        setValue,
        reset,
        formState: { errors }
    } = useForm<{ name: string; description?: string }>();

    const [showLoader, setShowLoader] = useState(false);
    const [type, setType] = useState<SegmentType>('DYNAMIC');

    const [specialDates, setSpecialDates] = useState<ISpecialDate[]>([]);
    const [categories, setCategories] = useState<ICategory[]>([]);

    const [usePurchaseRecency, setUsePurchaseRecency] = useState(false);
    const [purchaseRecency, setPurchaseRecency] = useState<IPurchaseRecencyFilter>({
        reference: 'SPECIAL_DATE',
        days_before: 3,
        days_after: 1,
    });

    const [useCategory, setUseCategory] = useState(false);
    const [categoryIds, setCategoryIds] = useState<string[]>([]);

    const [useMinOrderValue, setUseMinOrderValue] = useState(false);
    const [minOrderValue, setMinOrderValue] = useState<IMinOrderValueFilter>({ min_total: 0 });

    const [useMinOrderCount, setUseMinOrderCount] = useState(false);
    const [minOrderCount, setMinOrderCount] = useState<IMinOrderCountFilter>({ min_count: 5 });

    const [clientSearch, setClientSearch] = useState('');
    const [clientSearchResults, setClientSearchResults] = useState<ISegmentClient[]>([]);
    const [selectedClients, setSelectedClients] = useState<ISegmentClient[]>([]);

    const [previewCount, setPreviewCount] = useState<number | null>(null);
    const [previewLoading, setPreviewLoading] = useState(false);

    useEffect(() => {
        if (!isOpen) return;
        listSpecialDates().then((res) => setSpecialDates(res.data.specialDates || [])).catch(() => {});
        categoryService.getAllCategories().then(setCategories).catch(() => {});
    }, [isOpen]);

    const resetFilters = useCallback(() => {
        setType('DYNAMIC');
        setUsePurchaseRecency(false);
        setPurchaseRecency({ reference: 'SPECIAL_DATE', days_before: 3, days_after: 1 });
        setUseCategory(false);
        setCategoryIds([]);
        setUseMinOrderValue(false);
        setMinOrderValue({ min_total: 0 });
        setUseMinOrderCount(false);
        setMinOrderCount({ min_count: 5 });
        setSelectedClients([]);
        setClientSearch('');
        setClientSearchResults([]);
        setPreviewCount(null);
    }, []);

    useEffect(() => {
        if (isOpen && action === 'edit' && currentSegment) {
            setValue('name', currentSegment.name);
            setValue('description', currentSegment.description || undefined);
            setType(currentSegment.type);

            const criteria = currentSegment.criteria;
            if (criteria?.purchase_recency) {
                setUsePurchaseRecency(true);
                setPurchaseRecency(criteria.purchase_recency);
            }
            if (criteria?.category) {
                setUseCategory(true);
                setCategoryIds(criteria.category.category_ids);
            }
            if (criteria?.min_order_value) {
                setUseMinOrderValue(true);
                setMinOrderValue(criteria.min_order_value);
            }
            if (criteria?.min_order_count) {
                setUseMinOrderCount(true);
                setMinOrderCount(criteria.min_order_count);
            }

            if (currentSegment.type === 'MANUAL' && currentSegment.clients) {
                setSelectedClients(currentSegment.clients.map((c) => c.client));
            }
        } else if (isOpen && action === 'create') {
            reset({});
            resetFilters();
        }
    }, [isOpen, action, currentSegment, setValue, reset, resetFilters]);

    const buildCriteria = () => {
        const criteria: any = {};
        if (usePurchaseRecency) criteria.purchase_recency = purchaseRecency;
        if (useCategory && categoryIds.length > 0) criteria.category = { category_ids: categoryIds };
        if (useMinOrderValue) criteria.min_order_value = minOrderValue;
        if (useMinOrderCount) criteria.min_order_count = minOrderCount;
        return criteria;
    };

    const handlePreview = async () => {
        setPreviewLoading(true);
        try {
            const payload = type === 'DYNAMIC'
                ? { type, criteria: buildCriteria() }
                : { type, client_ids: selectedClients.map((c) => c.id) };

            const response = await previewSegmentDraft(payload);
            setPreviewCount(response.data.total);
        } catch (error) {
            console.error('Failed to preview segment:', error);
            setPreviewCount(null);
        } finally {
            setPreviewLoading(false);
        }
    };

    const handleClientSearch = async (query: string) => {
        setClientSearch(query);
        if (query.length < 2) {
            setClientSearchResults([]);
            return;
        }
        try {
            const response = await listClients(1, 10, query);
            const clients = (response.data.users || []) as ISegmentClient[];
            setClientSearchResults(clients.filter((c) => !selectedClients.some((s) => s.id === c.id)));
        } catch (error) {
            console.error('Failed to search clients:', error);
        }
    };

    const handleAddClient = (client: ISegmentClient) => {
        setSelectedClients((prev) => [...prev, client]);
        setClientSearchResults((prev) => prev.filter((c) => c.id !== client.id));
    };

    const handleRemoveClient = (clientId: string) => {
        setSelectedClients((prev) => prev.filter((c) => c.id !== clientId));
    };

    const toggleCategory = (categoryId: string) => {
        setCategoryIds((prev) =>
            prev.includes(categoryId) ? prev.filter((id) => id !== categoryId) : [...prev, categoryId]
        );
    };

    const onSubmit = async (formData: { name: string; description?: string }) => {
        setShowLoader(true);
        try {
            const payload: ICreateSegmentData = {
                name: formData.name,
                description: formData.description || null,
                type,
                ...(type === 'DYNAMIC'
                    ? { criteria: buildCriteria() }
                    : { client_ids: selectedClients.map((c) => c.id) }),
            };

            if (action === 'create') {
                await createSegment(payload);
            } else if (action === 'edit' && currentSegment) {
                await updateSegment(currentSegment.id, payload);
            }
            onSave();
            onRequestClose();
        } catch (error: any) {
            console.error('Failed to save segment:', error);
            const message = error.response?.data?.message || 'Erro ao salvar segmento';
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
                    <h2>{action === 'create' ? '🎯 Criar Segmento' : '✏️ Editar Segmento'}</h2>

                    <SectionTitle>📋 Identificação</SectionTitle>

                    <Label>Nome do Segmento *</Label>
                    {errors.name && <ErrorMessage>{errors.name.message}</ErrorMessage>}
                    <Input
                        type="text"
                        placeholder="Ex: Dia das Mães"
                        {...register('name', { required: 'Nome é obrigatório' })}
                    />

                    <Label>Descrição</Label>
                    <Input
                        type="text"
                        placeholder="Opcional"
                        {...register('description')}
                    />

                    <SectionTitle>🎯 Tipo de Segmento</SectionTitle>

                    <TypeTabs>
                        <TypeTabButton type="button" active={type === 'DYNAMIC'} onClick={() => setType('DYNAMIC')}>
                            Filtro Dinâmico
                        </TypeTabButton>
                        <TypeTabButton type="button" active={type === 'MANUAL'} onClick={() => setType('MANUAL')}>
                            Lista Manual
                        </TypeTabButton>
                    </TypeTabs>

                    {type === 'DYNAMIC' && (
                        <>
                            <FilterBlock>
                                <FilterBlockHeader>
                                    <CheckboxContainer>
                                        <Checkbox
                                            type="checkbox"
                                            checked={usePurchaseRecency}
                                            onChange={(e) => setUsePurchaseRecency(e.target.checked)}
                                        />
                                    </CheckboxContainer>
                                    📅 Recência de compra
                                </FilterBlockHeader>
                                {usePurchaseRecency && (
                                    <>
                                        <HelpText>Clientes que compraram próximo a uma data especial ou fixa.</HelpText>
                                        <FormRow>
                                            <div>
                                                <Label noMargin={false}>Referência</Label>
                                                <Select
                                                    value={purchaseRecency.reference}
                                                    onChange={(e) => setPurchaseRecency((prev) => ({ ...prev, reference: e.target.value as any }))}
                                                >
                                                    <option value="SPECIAL_DATE">Data Especial</option>
                                                    <option value="FIXED_DATE">Data Fixa</option>
                                                </Select>
                                            </div>
                                            {purchaseRecency.reference === 'SPECIAL_DATE' ? (
                                                <div>
                                                    <Label>Data Especial</Label>
                                                    <Select
                                                        value={purchaseRecency.special_date_id || ''}
                                                        onChange={(e) => setPurchaseRecency((prev) => ({ ...prev, special_date_id: e.target.value }))}
                                                    >
                                                        <option value="">Selecione...</option>
                                                        {specialDates.map((sd) => (
                                                            <option key={sd.id} value={sd.id}>{sd.name}</option>
                                                        ))}
                                                    </Select>
                                                </div>
                                            ) : (
                                                <div>
                                                    <Label>Data</Label>
                                                    <Input
                                                        type="date"
                                                        value={purchaseRecency.fixed_date ? String(purchaseRecency.fixed_date).split('T')[0] : ''}
                                                        onChange={(e) => setPurchaseRecency((prev) => ({ ...prev, fixed_date: e.target.value }))}
                                                    />
                                                </div>
                                            )}
                                        </FormRow>
                                        <FormRow>
                                            <div>
                                                <Label>Dias antes</Label>
                                                <Input
                                                    type="number"
                                                    min={0}
                                                    value={Number.isNaN(purchaseRecency.days_before) ? '' : purchaseRecency.days_before}
                                                    onChange={(e) => setPurchaseRecency((prev) => ({ ...prev, days_before: e.target.value === '' ? NaN : Number(e.target.value) }))}
                                                    onBlur={() => setPurchaseRecency((prev) => ({ ...prev, days_before: Number.isNaN(prev.days_before) ? 0 : prev.days_before }))}
                                                />
                                            </div>
                                            <div>
                                                <Label>Dias depois</Label>
                                                <Input
                                                    type="number"
                                                    min={0}
                                                    value={Number.isNaN(purchaseRecency.days_after) ? '' : purchaseRecency.days_after}
                                                    onChange={(e) => setPurchaseRecency((prev) => ({ ...prev, days_after: e.target.value === '' ? NaN : Number(e.target.value) }))}
                                                    onBlur={() => setPurchaseRecency((prev) => ({ ...prev, days_after: Number.isNaN(prev.days_after) ? 0 : prev.days_after }))}
                                                />
                                            </div>
                                        </FormRow>
                                    </>
                                )}
                            </FilterBlock>

                            <FilterBlock>
                                <FilterBlockHeader>
                                    <CheckboxContainer>
                                        <Checkbox
                                            type="checkbox"
                                            checked={useCategory}
                                            onChange={(e) => setUseCategory(e.target.checked)}
                                        />
                                    </CheckboxContainer>
                                    🌸 Categoria de produto
                                </FilterBlockHeader>
                                {useCategory && (
                                    <>
                                        <HelpText>Clientes que compraram produtos das categorias selecionadas.</HelpText>
                                        <CategoryChecklist>
                                            {categories.map((category) => (
                                                <CategoryChip key={category.id} selected={categoryIds.includes(category.id)}>
                                                    <input
                                                        type="checkbox"
                                                        style={{ display: 'none' }}
                                                        checked={categoryIds.includes(category.id)}
                                                        onChange={() => toggleCategory(category.id)}
                                                    />
                                                    {category.name}
                                                </CategoryChip>
                                            ))}
                                        </CategoryChecklist>
                                    </>
                                )}
                            </FilterBlock>

                            <FilterBlock>
                                <FilterBlockHeader>
                                    <CheckboxContainer>
                                        <Checkbox
                                            type="checkbox"
                                            checked={useMinOrderValue}
                                            onChange={(e) => setUseMinOrderValue(e.target.checked)}
                                        />
                                    </CheckboxContainer>
                                    💰 Valor mínimo do pedido
                                </FilterBlockHeader>
                                {useMinOrderValue && (
                                    <>
                                        <HelpText>Considera apenas pedidos com valor igual ou acima do informado.</HelpText>
                                        <Input
                                            type="number"
                                            step="0.01"
                                            min={0}
                                            value={Number.isNaN(minOrderValue.min_total) ? '' : minOrderValue.min_total}
                                            onChange={(e) => setMinOrderValue({ min_total: e.target.value === '' ? NaN : Number(e.target.value) })}
                                            onBlur={() => setMinOrderValue((prev) => ({ min_total: Number.isNaN(prev.min_total) ? 0 : prev.min_total }))}
                                        />
                                    </>
                                )}
                            </FilterBlock>

                            <FilterBlock>
                                <FilterBlockHeader>
                                    <CheckboxContainer>
                                        <Checkbox
                                            type="checkbox"
                                            checked={useMinOrderCount}
                                            onChange={(e) => setUseMinOrderCount(e.target.checked)}
                                        />
                                    </CheckboxContainer>
                                    🏆 Quantidade mínima de pedidos (top clientes)
                                </FilterBlockHeader>
                                {useMinOrderCount && (
                                    <>
                                        <HelpText>
                                            Clientes com N pedidos ou mais, considerando todo o histórico —
                                            não precisa ser no mesmo pedido dos outros filtros.
                                        </HelpText>
                                        <Input
                                            type="number"
                                            min={1}
                                            value={Number.isNaN(minOrderCount.min_count) ? '' : minOrderCount.min_count}
                                            onChange={(e) => setMinOrderCount({ min_count: e.target.value === '' ? NaN : Number(e.target.value) })}
                                            onBlur={() => setMinOrderCount((prev) => ({ min_count: Number.isNaN(prev.min_count) || prev.min_count < 1 ? 1 : prev.min_count }))}
                                        />
                                    </>
                                )}
                            </FilterBlock>
                        </>
                    )}

                    {type === 'MANUAL' && (
                        <FilterBlock>
                            <SectionTitle>👥 Clientes do Segmento</SectionTitle>
                            <Label>Buscar cliente por nome ou telefone</Label>
                            <Input
                                type="text"
                                placeholder="Digite para buscar..."
                                value={clientSearch}
                                onChange={(e) => handleClientSearch(e.target.value)}
                            />
                            {clientSearchResults.length > 0 && (
                                <ClientSearchResults>
                                    {clientSearchResults.map((client) => (
                                        <ClientSearchResultItem
                                            type="button"
                                            key={client.id}
                                            onClick={() => handleAddClient(client)}
                                        >
                                            <span>{client.first_name} {client.last_name}</span>
                                            <span>{client.phone_number}</span>
                                        </ClientSearchResultItem>
                                    ))}
                                </ClientSearchResults>
                            )}

                            <SelectedClientsList>
                                {selectedClients.map((client) => (
                                    <SelectedClientItem key={client.id}>
                                        <span>{client.first_name} {client.last_name} — {client.phone_number}</span>
                                        <button type="button" onClick={() => handleRemoveClient(client.id)}>Remover</button>
                                    </SelectedClientItem>
                                ))}
                            </SelectedClientsList>
                            {selectedClients.length === 0 && (
                                <HelpText>Nenhum cliente adicionado ainda.</HelpText>
                            )}
                        </FilterBlock>
                    )}

                    <button type="button" className="create-button" style={{ backgroundColor: '#555' }} onClick={handlePreview} disabled={previewLoading}>
                        {previewLoading ? 'Calculando...' : '🔍 Ver quantos clientes casam com o segmento'}
                    </button>

                    {previewCount !== null && (
                        <PreviewBox>
                            <strong>{previewCount}</strong> cliente(s) encontrado(s)
                        </PreviewBox>
                    )}

                    <button type="submit" className="create-button">
                        {action === 'create' ? 'Criar Segmento' : 'Atualizar Segmento'}
                    </button>
                </Form>
            </ModalContainer>
        </Modal>
    );
}
