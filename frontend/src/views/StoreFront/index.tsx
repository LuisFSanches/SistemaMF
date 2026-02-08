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
import { CategoryMenu } from "../../components/CategoryMenu";
import { BannerCarousel } from "../../components/BannerCarousel";
import { DeliveryAvailability } from "../../components/DeliveryAvailability";
import { GoogleRating } from "../../components/GoogleRating";
import { StoreFrontFooter } from "../../components/StoreFrontFooter";
import placeholder_products from "../../assets/images/placeholder_products.png";
import {
    Container,
    Content,
    ProductGrid,
    EmptyState,
    DeliverySession,
    SessionTitle,
    SessionContent,
    ReviewSession
} from "./style";

interface Schedule {
    id: string;
    day_of_week: string;
    is_closed: boolean;
    opening_time: string | null;
    closing_time: string | null;
    lunch_break_start: string | null;
    lunch_break_end: string | null;
    created_at: string;
    updated_at: string;
}

interface Store {
    id: string;
    name: string;
    slug: string;
    logo: string | null;
    banner: string | null;
    banner_2?: string | null;
    banner_3?: string | null;
    schedules?: Schedule[];
    google_rating_value: number | null;
    google_rating_count: number | null;
    google_rating_url: string | null;
}

export function StoreFront() {
    const { slug, categorySlug } = useParams<{ slug: string; categorySlug?: string }>();
    const { addToCart } = useCart();
    const [products, setProducts] = useState<any[]>([]);
    const [totalProducts, setTotalProducts] = useState(0);
    const [store, setStore] = useState<Store | null>(null);
    const [showLoader, setShowLoader] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(12);

    const loadAvailableProducts = async (slug: string, page: number, pageSize: number, categorySlug?: string) => {
        try {
            setError(null);
            const { data: { products, total, store } } = await listStoreFrontProducts(slug, page, pageSize, "", categorySlug);

            // Salvar store_id, store_name, phone_number e schedules no localStorage para uso no checkout e PDP
            if (store?.id) {
                localStorage.setItem('storefront_store_id', store.id);
            }
            if (store?.name) {
                localStorage.setItem('storefront_store_name', store.name);
            }
            if (store?.phone_number) {
                localStorage.setItem('storefront_store_phone', store.phone_number);
            }
            if (store?.schedules) {
                localStorage.setItem('storefront_store_schedules', JSON.stringify(store.schedules));
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
        if (!slug) return;
        
        setShowLoader(true);
        loadAvailableProducts(slug, page, pageSize, categorySlug).then(() => {
            setTimeout(() => {
                setShowLoader(false);
            }, 350);
        });

    }, [slug, page, pageSize, categorySlug]);

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

    console.log(store)

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
                <StoreFrontFooter />
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
                <StoreFrontFooter />
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
                <StoreFrontFooter />
            </Container>
        );
    }

    return (
        <Container>
            <StoreFrontHeader 
                showCartButton 
                logoSrc={store?.logo || undefined}
                storeName={store?.name}
                slug={slug}
                showSearch={true}
            />

            <CategoryMenu 
                storeSlug={slug || ''} 
                selectedCategorySlug={categorySlug}
            />
            {!categorySlug && store && (
                <BannerCarousel 
                    banners={[
                        store.banner,
                        store.banner_2,
                        store.banner_3
                    ].filter(Boolean) as string[]}
                    storeName={store.name}
                />
            )}

            <Content>
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
                                        enableDetailView={true}
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

                {!categorySlug && store?.schedules && store.schedules.length > 0 && (
                    <DeliverySession>
                        <SessionTitle>Disponibilidade de <strong>Entrega</strong></SessionTitle>
                        <SessionContent>
                            <p>Confira abaixo os dias de funcionamento da nossa loja. Fique atento para possíveis alterações nos horários de entrega.</p>
                            <DeliveryAvailability schedules={store.schedules} />
                        </SessionContent>
                    </DeliverySession>
                )}

                {!categorySlug && store?.google_rating_value && store?.google_rating_count && store?.google_rating_url && (
                    <ReviewSession>
                        <SessionTitle>Avaliações no <strong>Google</strong></SessionTitle>
                        <SessionContent>
                            <GoogleRating
                                ratingValue={store.google_rating_value}
                                ratingCount={store.google_rating_count}
                                ratingUrl={store.google_rating_url}
                            />
                        </SessionContent>
                    </ReviewSession>
                )}
            </Content>
            <StoreFrontFooter />
        </Container>
    );
}
