import { useState, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faPen } from "@fortawesome/free-solid-svg-icons";
import { listOnlineStoreProducts } from "../../services/storeProductService";
import { useAdminData } from "../../contexts/AuthContext";
import { Loader } from "../../components/Loader";
import { StoreProductModal } from "../../components/StoreProductModal";
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
    OnlineBadge
} from "./style";
import { PageHeader, PageTitle } from "../../styles/global";
import placeholder_products from '../../assets/images/placeholder_products.png';

export function OnlineStoreProducts() {
    const { adminData } = useAdminData();
    const [products, setProducts] = useState<IProduct[]>([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [totalProducts, setTotalProducts] = useState(0);
    const [query, setQuery] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [showSuccess, setShowSuccess] = useState(false);

    // Modal states
    const [isProductModalOpen, setIsProductModalOpen] = useState(false);
    const [currentProduct, setCurrentProduct] = useState<IProduct>({} as IProduct);

    const pageSize = 20;

    useEffect(() => {
        if (adminData.store_id) {
            fetchProducts();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page, query, adminData.store_id]);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const response = await listOnlineStoreProducts(
                adminData.store_id as string,
                page,
                pageSize,
                query
            );
            setProducts(response.data.products);
            setTotalProducts(response.data.total);
        } catch (error) {
            console.error("Erro ao buscar produtos online:", error);
            alert("Erro ao carregar produtos do catálogo online.");
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (text: string) => {
        setQuery(text);
        setPage(1);
    };

    const handleOpenEditModal = (product: IProduct) => {
        setCurrentProduct(product);
        setIsProductModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsProductModalOpen(false);
        setCurrentProduct({} as IProduct);
    };

    const loadData = async (storeId: string) => {
        await fetchProducts();
    };

    return (
        <Container>
            {showSuccess && (
                <SuccessMessage
                    message="Produto atualizado com sucesso!"
                    onClose={() => setShowSuccess(false)}
                />
            )}

            <PageHeader>
                <PageTitle>
                    <h1>Produtos do Catálogo Online</h1>
                    <p>Gerenciar produtos visíveis na loja online</p>
                </PageTitle>
                <OnlineBadge>
                    🌐 Loja Online
                </OnlineBadge>
            </PageHeader>

            <SearchContainer>
                <div className="search-box">
                    <FontAwesomeIcon icon={faSearch} />
                    <input
                        type="text"
                        placeholder="Buscar produtos do catálogo online..."
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
                            {query ? (
                                <>
                                    Nenhum produto online encontrado com "{query}"
                                </>
                            ) : (
                                <>
                                    Nenhum produto visível no catálogo online.
                                    <br />
                                    <small>
                                        Para adicionar produtos, vá em "Meus Produtos" e habilite a
                                        opção "Visível para o cliente"
                                    </small>
                                </>
                            )}
                        </EmptyState>
                    ) : (
                        <>
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
                                                <span className="stock">Estoque: {product.stock}</span>
                                            </div>
                                            <div className="status">
                                                <span className={product.enabled ? 'enabled' : 'disabled'}>
                                                    {product.enabled ? 'Ativo' : 'Inativo'}
                                                </span>
                                                <span className="online">Visível Online</span>
                                            </div>
                                        </ProductInfo>

                                        <ProductActions>
                                            <ActionButton
                                                className="edit"
                                                onClick={() => handleOpenEditModal(product)}
                                                title="Editar produto"
                                            >
                                                <FontAwesomeIcon icon={faPen} />
                                                Editar
                                            </ActionButton>
                                        </ProductActions>
                                    </ProductRow>
                                ))}
                            </ProductsTable>

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
                </>
            )}

            {isProductModalOpen && (
                <StoreProductModal
                    isOpen={isProductModalOpen}
                    onRequestClose={handleCloseModal}
                    loadData={loadData}
                    action="edit"
                    currentProduct={currentProduct}
                />
            )}
        </Container>
    );
}
