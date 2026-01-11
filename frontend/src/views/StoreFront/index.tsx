import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { useCart } from "../../contexts/CartContext";
import { listStoreFrontProducts } from "../../services/productService";
import { ProductCard } from "../../components/ProductCard";
import { Pagination } from "../../components/Pagination";
import { Loader } from "../../components/Loader";
import { StoreFrontHeader } from "../../components/StoreFrontHeader";
import placeholder_products from "../../assets/images/placeholder_products.png";
import {
    Container,
    Content,
    PageTitle,
    SearchContainer,
    SearchInput,
    ProductGrid,
    EmptyState,
} from "./style";

interface Store {
    id: string;
    name: string;
    slug: string;
    logo: string | null;
    banner: string | null;
    banner_2?: string | null;
    banner_3?: string | null;
}

export function StoreFront() {
    const { slug } = useParams<{ slug: string }>();
    const { addToCart } = useCart();
    const [products, setProducts] = useState<any[]>([]);
    const [totalProducts, setTotalProducts] = useState(0);
    const [store, setStore] = useState<Store | null>(null);
    const [showLoader, setShowLoader] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [query, setQuery] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(12);

    const loadAvailableProducts = async (slug: string, page: number, pageSize: number, query: string) => {
        try {
            setError(null);
            const { data: { products, total, store } } = await listStoreFrontProducts(slug, page, pageSize, query);

            // Salvar store_id no localStorage para uso no checkout
            if (store?.id) {
                localStorage.setItem('storefront_store_id', store.id);
            }
            
            setProducts(products);
            setTotalProducts(total);
            setStore(store);
        } catch (err: any) {
            console.error('Erro ao carregar produtos:', err);
            if (err.response?.status === 404) {
                setError('store_not_found');
            } else if (err.response?.data?.message === 'Store is not active') {
                setError('store_inactive');
            } else {
                setError('unknown_error');
            }
            setProducts([]);
            setTotalProducts(0);
            setStore(null);
        }
    }

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            setQuery(searchTerm);
            setPage(1);
        }, 1000);

        return () => clearTimeout(timeoutId);
    }, [searchTerm]);

    useEffect(() => {
        if (!slug) return;
        
        setShowLoader(true);
        loadAvailableProducts(slug, page, pageSize, query).then(() => {
            setTimeout(() => {
                setShowLoader(false);
            }, 350);
        });

    }, [slug, page, pageSize, query]);

    useEffect(() => {
        function handleResize() {
            const width = window.innerWidth;
            if (width < 800) {
                setPageSize(4);
            } else if (width < 1300) {
                setPageSize(8);
            } else {
                setPageSize(12);
            }
        }

        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const handleAddProduct = (product: any, quantity: number, price: number) => {
        console.log('[StoreFront] Adicionando ao carrinho:', { id: product.id, name: product.name, price });
        addToCart({ ...product, price }, quantity);
    };

    if (error === 'store_not_found') {
        return (
            <Container>
                <StoreFrontHeader showCartButton />
                <Content>
                    <EmptyState>
                        <FontAwesomeIcon icon={faSearch as any} />
                        <h3>Loja não encontrada</h3>
                        <p>O slug "{slug}" não corresponde a nenhuma loja ativa.</p>
                    </EmptyState>
                </Content>
            </Container>
        );
    }

    if (error === 'store_inactive') {
        return (
            <Container>
                <StoreFrontHeader showCartButton />
                <Content>
                    <EmptyState>
                        <FontAwesomeIcon icon={faSearch as any} />
                        <h3>Loja Temporariamente Indisponível</h3>
                        <p>Esta loja está desativada no momento. Tente novamente mais tarde.</p>
                    </EmptyState>
                </Content>
            </Container>
        );
    }

    if (error === 'unknown_error') {
        return (
            <Container>
                <StoreFrontHeader showCartButton />
                <Content>
                    <EmptyState>
                        <FontAwesomeIcon icon={faSearch as any} />
                        <h3>Erro ao carregar produtos</h3>
                        <p>Ocorreu um erro ao carregar os produtos. Tente novamente mais tarde.</p>
                    </EmptyState>
                </Content>
            </Container>
        );
    }

    return (
        <Container>
            <StoreFrontHeader 
                showCartButton 
                store={store}
                slug={slug}
            />

            <Content>
                <PageTitle>{store?.name || 'Nossos Produtos'}</PageTitle>

                <SearchContainer>
                    <SearchInput
                        placeholder="Buscar produtos..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </SearchContainer>

                <Loader show={showLoader} />

                {!showLoader && products.length === 0 && (
                    <EmptyState>
                        <FontAwesomeIcon icon={faSearch as any} />
                        <h3>Nenhum produto encontrado</h3>
                        <p>Tente buscar por outro termo</p>
                    </EmptyState>
                )}

                {!showLoader && products.length > 0 && (
                    <>
                        <ProductGrid>
                            {products
                                .filter((product) => product.enabled && product.stock > 0)
                                .map((product) => (
                                    <ProductCard
                                        key={product.id}
                                        product={product}
                                        image={product.image || placeholder_products}
                                        onAdd={handleAddProduct}
                                        editablePrice={false}
                                    />
                                ))}
                        </ProductGrid>

                        <Pagination
                            currentPage={page}
                            total={totalProducts}
                            pageSize={pageSize}
                            onPageChange={setPage}
                        />
                    </>
                )}
            </Content>
        </Container>
    );
}
