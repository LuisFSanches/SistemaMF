import { useState, useEffect, useCallback } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faSearch, faPen, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useAdminData } from "../../contexts/AuthContext";
import { Loader } from "../../components/Loader";
import { Pagination } from "../../components/Pagination";
import { ConfirmPopUp } from "../../components/ConfirmPopUp";
import { SuccessMessage } from "../../components/SuccessMessage";
import { ProductVariantGroupModal } from "../../components/ProductVariantGroupModal";
import { ProductColorModal, IProductColorForm } from "../../components/ProductColorModal";
import { IProductColor, IProductVariantGroup } from "../../interfaces/IProductVariant";
import {
    listProductColors,
    createProductColor,
    updateProductColor,
    deleteProductColor,
    listProductVariantGroups,
    deleteProductVariantGroup
} from "../../services/productVariantService";
import { PageHeader, PageTitle } from "../../styles/global";
import {
    Container,
    SearchContainer,
    SearchButton,
    AddButton,
    EmptyState,
    UnauthorizedMessage,
    Tabs,
    Tab,
    List,
    Row,
    RowInfo,
    ColorChips,
    ColorChip,
    Dot,
    Actions
} from "./style";

type TabKey = 'groups' | 'colors';

export function ProductVariantGroups() {
    const { adminData } = useAdminData();
    const hasPermission = adminData.role === 'SYS_ADMIN';

    const [activeTab, setActiveTab] = useState<TabKey>('groups');
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    const [groups, setGroups] = useState<IProductVariantGroup[]>([]);
    const [totalGroups, setTotalGroups] = useState(0);
    const [page, setPage] = useState(1);
    const [query, setQuery] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const pageSize = 20;

    const [colors, setColors] = useState<IProductColor[]>([]);

    const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
    const [currentGroup, setCurrentGroup] = useState<IProductVariantGroup | null>(null);
    const [isColorModalOpen, setIsColorModalOpen] = useState(false);
    const [currentColor, setCurrentColor] = useState<IProductColor | null>(null);
    const [pendingDelete, setPendingDelete] = useState<{ type: TabKey; id: string } | null>(null);

    const showSuccess = (message: string) => {
        setSuccessMessage(message);
        setTimeout(() => setSuccessMessage(''), 3000);
    };

    const fetchGroups = useCallback(async () => {
        try {
            setLoading(true);
            const { data } = await listProductVariantGroups(page, pageSize, query);
            setGroups(data.groups);
            setTotalGroups(data.total);
        } catch (error) {
            console.error("Erro ao buscar grupos de cores:", error);
        } finally {
            setLoading(false);
        }
    }, [page, query]);

    const fetchColors = useCallback(async () => {
        try {
            const { data } = await listProductColors();
            setColors(data);
        } catch (error) {
            console.error("Erro ao buscar cores:", error);
        }
    }, []);

    useEffect(() => {
        if (hasPermission) {
            fetchGroups();
        }
    }, [hasPermission, fetchGroups]);

    useEffect(() => {
        if (hasPermission) {
            fetchColors();
        }
    }, [hasPermission, fetchColors]);

    const handleSearch = () => {
        setQuery(searchQuery);
        setPage(1);
    };

    const handleOpenGroupModal = (group: IProductVariantGroup | null) => {
        setCurrentGroup(group);
        setIsGroupModalOpen(true);
    };

    const handleOpenColorModal = (color: IProductColor | null) => {
        setCurrentColor(color);
        setIsColorModalOpen(true);
    };

    const handleSaveColor = async (data: IProductColorForm) => {
        try {
            const payload = { ...data, hex: data.is_mixed ? null : data.hex };
            if (currentColor) {
                await updateProductColor({ ...currentColor, ...payload });
            } else {
                await createProductColor(payload);
            }
            await fetchColors();
            setIsColorModalOpen(false);
            showSuccess(currentColor ? "Cor atualizada!" : "Cor criada!");
        } catch (error: any) {
            alert(error.response?.data?.message || "Erro ao salvar a cor.");
        }
    };

    const handleConfirmDelete = async () => {
        if (!pendingDelete) return;

        try {
            setLoading(true);
            if (pendingDelete.type === 'groups') {
                await deleteProductVariantGroup(pendingDelete.id);
                await fetchGroups();
                showSuccess("Grupo removido. Os produtos foram mantidos.");
            } else {
                await deleteProductColor(pendingDelete.id);
                await fetchColors();
                showSuccess("Cor removida!");
            }
        } catch (error: any) {
            alert(error.response?.data?.message || "Erro ao remover.");
        } finally {
            setLoading(false);
            setPendingDelete(null);
        }
    };

    if (!hasPermission) {
        return (
            <Container>
                <PageHeader>
                    <PageTitle>
                        <h1>Variações de Cor</h1>
                    </PageTitle>
                </PageHeader>
                <UnauthorizedMessage>
                    <h2>Acesso Restrito</h2>
                    <p>Somente administradores do sistema podem acessar esta página.</p>
                </UnauthorizedMessage>
            </Container>
        );
    }

    return (
        <Container>
            {successMessage && (
                <SuccessMessage message={successMessage} onClose={() => setSuccessMessage('')} />
            )}

            <PageHeader>
                <PageTitle>
                    <h1>Variações de Cor</h1>
                    <p>Agrupe o mesmo produto em cores diferentes para o cliente e o balcão trocarem só a cor</p>
                </PageTitle>
                {activeTab === 'groups' ? (
                    <AddButton onClick={() => handleOpenGroupModal(null)}>
                        <FontAwesomeIcon icon={faPlus} />
                        Novo Grupo
                    </AddButton>
                ) : (
                    <AddButton onClick={() => handleOpenColorModal(null)}>
                        <FontAwesomeIcon icon={faPlus} />
                        Nova Cor
                    </AddButton>
                )}
            </PageHeader>

            <Tabs role="tablist">
                <Tab role="tab" aria-selected={activeTab === 'groups'} $active={activeTab === 'groups'} onClick={() => setActiveTab('groups')}>
                    Grupos ({totalGroups})
                </Tab>
                <Tab role="tab" aria-selected={activeTab === 'colors'} $active={activeTab === 'colors'} onClick={() => setActiveTab('colors')}>
                    Paleta de cores ({colors.length})
                </Tab>
            </Tabs>

            {activeTab === 'groups' && (
                <>
                    <SearchContainer>
                        <div className="search-box">
                            <FontAwesomeIcon icon={faSearch} />
                            <input
                                type="text"
                                placeholder="Buscar por grupo ou produto..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                            />
                            <SearchButton type="button" onClick={handleSearch}>Buscar</SearchButton>
                        </div>
                    </SearchContainer>

                    {loading ? (
                        <Loader show={loading} />
                    ) : groups.length === 0 ? (
                        <EmptyState>Nenhum grupo de cores encontrado</EmptyState>
                    ) : (
                        <List>
                            {groups.map(group => (
                                <Row key={group.id}>
                                    <RowInfo>
                                        <h3>{group.name}</h3>
                                        <ColorChips>
                                            {group.products.map(product => (
                                                <ColorChip
                                                    key={product.id}
                                                    className={product.enabled ? '' : 'disabled'}
                                                    title={product.name}
                                                >
                                                    <Dot $hex={product.color?.hex || null} $mixed={!!product.color?.is_mixed} />
                                                    {product.color?.name || 'Sem cor'}
                                                </ColorChip>
                                            ))}
                                        </ColorChips>
                                        <p>{group.products.length} produto(s)</p>
                                    </RowInfo>
                                    <Actions>
                                        <button className="edit" onClick={() => handleOpenGroupModal(group)}>
                                            <FontAwesomeIcon icon={faPen} />
                                            Editar
                                        </button>
                                        <button className="delete" onClick={() => setPendingDelete({ type: 'groups', id: group.id })}>
                                            <FontAwesomeIcon icon={faTrash} />
                                            Desfazer grupo
                                        </button>
                                    </Actions>
                                </Row>
                            ))}
                        </List>
                    )}

                    {totalGroups > pageSize && (
                        <Pagination currentPage={page} total={totalGroups} pageSize={pageSize} onPageChange={setPage} />
                    )}
                </>
            )}

            {activeTab === 'colors' && (
                <List>
                    {colors.map(color => (
                        <Row key={color.id}>
                            <Dot $hex={color.hex} $mixed={color.is_mixed} $size={32} />
                            <RowInfo>
                                <h3>{color.name}</h3>
                                <p>
                                    {color.is_mixed ? 'Cor mista' : color.hex} · usada em {color._count?.products || 0} produto(s)
                                </p>
                            </RowInfo>
                            <Actions>
                                <button className="edit" onClick={() => handleOpenColorModal(color)}>
                                    <FontAwesomeIcon icon={faPen} />
                                    Editar
                                </button>
                                <button
                                    className="delete"
                                    disabled={(color._count?.products || 0) > 0}
                                    title={(color._count?.products || 0) > 0 ? 'Cor em uso' : 'Remover cor'}
                                    onClick={() => setPendingDelete({ type: 'colors', id: color.id })}
                                >
                                    <FontAwesomeIcon icon={faTrash} />
                                    Remover
                                </button>
                            </Actions>
                        </Row>
                    ))}
                </List>
            )}

            <ProductVariantGroupModal
                isOpen={isGroupModalOpen}
                onRequestClose={() => setIsGroupModalOpen(false)}
                onSaved={async () => {
                    await Promise.all([fetchGroups(), fetchColors()]);
                    showSuccess(currentGroup ? "Grupo atualizado!" : "Grupo criado!");
                }}
                currentGroup={currentGroup}
                colors={colors}
            />

            <ProductColorModal
                isOpen={isColorModalOpen}
                onRequestClose={() => setIsColorModalOpen(false)}
                onSave={handleSaveColor}
                currentColor={currentColor}
            />

            <ConfirmPopUp
                isOpen={!!pendingDelete}
                onRequestClose={() => setPendingDelete(null)}
                handleAction={handleConfirmDelete}
                actionLabel="Confirmar"
                label={pendingDelete?.type === 'groups'
                    ? "Desfazer este grupo? Os produtos NÃO serão apagados, apenas deixarão de aparecer agrupados."
                    : "Remover esta cor da paleta?"}
            />
        </Container>
    );
}
