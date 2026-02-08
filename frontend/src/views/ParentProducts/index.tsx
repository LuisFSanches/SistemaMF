import { useState, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faSearch, faPen, faTrash } from "@fortawesome/free-solid-svg-icons";
import { listProducts, deleteProduct } from "../../services/productService";
import { useAdminData } from "../../contexts/AuthContext";
import { Loader } from "../../components/Loader";
import { ProductModal } from "../../components/ProductModal";
import { ConfirmPopUp } from "../../components/ConfirmPopUp";
import { Pagination } from "../../components/Pagination";
import { SuccessMessage } from "../../components/SuccessMessage";
import { IProduct } from "../../interfaces/IProduct";
import { UNITIES } from "../../constants";
import {
    Container,
    SearchContainer,
    SearchButton,
    ProductsTable,
    ProductRow,
    ProductImage,
    ProductInfo,
    ProductActions,
    ActionButton,
    EmptyState,
    AddButton,
    UnauthorizedMessage
} from "./style";
import { PageHeader, PageTitle } from "../../styles/global";
import placeholder_products from '../../assets/images/placeholder_products.png';

export function ParentProducts() {
    const { adminData } = useAdminData();
    const [products, setProducts] = useState<IProduct[]>([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [totalProducts, setTotalProducts] = useState(0);
    const [query, setQuery] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [showSuccess, setShowSuccess] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    // Modal states
    const [isProductModalOpen, setIsProductModalOpen] = useState(false);
    const [modalAction, setModalAction] = useState<'create' | 'edit'>('create');
    const [currentProduct, setCurrentProduct] = useState<IProduct>({} as IProduct);

    // Delete confirmation
    const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
    const [productIdToDelete, setProductIdToDelete] = useState<string>("");

    const pageSize = 20;

    // Verifica se o admin tem permissão (SYS_ADMIN)
    const hasPermission = adminData.role === 'SYS_ADMIN';

    useEffect(() => {
        if (hasPermission) {
            fetchProducts();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page, query, hasPermission]);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const response = await listProducts(page, pageSize, query);
            setProducts(response.data.products);
            setTotalProducts(response.data.total);
        } catch (error) {
            console.error("Erro ao buscar produtos:", error);
            alert("Erro ao carregar produtos do catálogo geral.");
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (text: string) => {
        setQuery(text);
        setPage(1);
    };

    const handleOpenCreateModal = () => {
        setCurrentProduct({
            id: "",
            name: "",
            image: "",
            image_2: "",
            image_3: "",
            price: 0,
            unity: "",
            stock: 0,
            enabled: true,
            visible_in_store: true,
            qr_code: "",
            sales_count: 0
        } as IProduct);
        setModalAction('create');
        setIsProductModalOpen(true);
    };

    const handleOpenEditModal = (product: IProduct) => {
        setCurrentProduct(product);
        setModalAction('edit');
        setIsProductModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsProductModalOpen(false);
        setCurrentProduct({} as IProduct);
    };

    const handleOpenDeletePopup = (productId: string) => {
        setProductIdToDelete(productId);
        setIsDeletePopupOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!productIdToDelete) return;

        try {
            setLoading(true);
            await deleteProduct(productIdToDelete);
            setSuccessMessage("Product successfully deleted!");
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 3000);
            await fetchProducts();
        } catch (error) {
            console.error("Error deleting product:", error);
            alert("Error deleting product. Check if it's not being used in orders.");
        } finally {
            setLoading(false);
            setIsDeletePopupOpen(false);
            setProductIdToDelete("");
        }
    };

    const loadData = async () => {
        await fetchProducts();
    };

    if (!hasPermission) {
        return (
            <Container>
                <PageHeader>
                    <PageTitle>
                        <h1>Produtos Pais</h1>
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
            {showSuccess && (
                <SuccessMessage
                    message={successMessage}
                    onClose={() => setShowSuccess(false)}
                />
            )}

            <PageHeader>
                <PageTitle>
                    <h1>Produtos Pais</h1>
                    <p>Gerenciar produtos pais do catálogo geral</p>
                </PageTitle>
                <AddButton onClick={handleOpenCreateModal}>
                    <FontAwesomeIcon icon={faPlus} />
                    Novo Produto
                </AddButton>
            </PageHeader>

            <SearchContainer>
                <div className="search-box">
                    <FontAwesomeIcon icon={faSearch} />
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={searchQuery}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                        onKeyDown={(e: any) => {
                            if (e.key === 'Enter') {
                                handleSearch(searchQuery);
                            }
                        }}
                    />
                    <SearchButton
                        type="button"
                        onClick={() => handleSearch(searchQuery)}
                    >
                        Buscar
                    </SearchButton>
                </div>
            </SearchContainer>

            {loading ? (
                <Loader show={loading} />
            ) : (
                <>
                    {products.length === 0 ? (
                        <EmptyState>
                            Nenhum produto encontrado no catálogo geral
                        </EmptyState>
                    ) : (
                        <ProductsTable>
                            {products.map((product) => (
                                <ProductRow key={product.id}>
                                    <ProductImage>
                                        <img
                                            src={product.image || placeholder_products}
                                            alt={product.name}
                                            onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                                                (e.target as HTMLImageElement).src = placeholder_products;
                                            }}
                                        />
                                    </ProductImage>

                                    <ProductInfo>
                                        <h3>{product.name}</h3>
                                        <div className="details">
                                            <span className="price">R$ {parseFloat(product.price as any).toFixed(2)}</span>
                                            <span className="unity">{UNITIES[product.unity as keyof typeof UNITIES] || product.unity}</span>
                                            <span className="stock">Stock: {product.stock}</span>
                                        </div>
                                        <div className="status">
                                            <span className={product.enabled ? 'enabled' : 'disabled'}>
                                                {product.enabled ? 'Active' : 'Inactive'}
                                            </span>
                                            {product.visible_in_store && (
                                                <span className="visible">Visible in Store</span>
                                            )}
                                        </div>
                                    </ProductInfo>

                                    <ProductActions>
                                        <ActionButton
                                            className="edit"
                                            onClick={() => handleOpenEditModal(product)}
                                            title="Edit product"
                                        >
                                            <FontAwesomeIcon icon={faPen} />
                                            Editar
                                        </ActionButton>
                                        <ActionButton
                                            className="delete"
                                            onClick={() => handleOpenDeletePopup(product.id || '')}
                                            title="Delete product"
                                        >
                                            <FontAwesomeIcon icon={faTrash} />
                                            Remover
                                        </ActionButton>
                                    </ProductActions>
                                </ProductRow>
                            ))}
                        </ProductsTable>
                    )}

                    {totalProducts > pageSize && (
                        <Pagination
                            currentPage={page}
                            total={totalProducts}
                            pageSize={pageSize}
                            onPageChange={setPage}
                        />
                    )}
                </>
            )}

            <ProductModal
                isOpen={isProductModalOpen}
                onRequestClose={handleCloseModal}
                loadData={loadData}
                action={modalAction}
                currentProduct={currentProduct}
            />

            <ConfirmPopUp
                isOpen={isDeletePopupOpen}
                onRequestClose={() => {
                    setIsDeletePopupOpen(false);
                    setProductIdToDelete("");
                }}
                handleAction={handleConfirmDelete}
                actionLabel="Remover"
                label="Tem certeza de que deseja remover este produto? Esta ação não pode ser desfeita."
            />
        </Container>
    );
}
