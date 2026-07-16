import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { useCart } from "../../contexts/CartContext";
import { useGTM } from "../../hooks/useGTM";
import { listStoreFrontProducts } from "../../services/productService";
import { listStorefrontCarousels } from "../../services/carouselService";
import { IStoreCarousel } from "../../interfaces/IStoreCarousel";
import { ProductCard } from "../../components/ProductCard";
import { Pagination } from "../../components/Pagination";
import { Loader } from "../../components/Loader";
import { StoreFrontHeader } from "../../components/StoreFrontHeader";
import { CategoryMenu } from "../../components/CategoryMenu";
import { BannerCarousel } from "../../components/BannerCarousel";
import { StorefrontCarousel } from "../../components/StorefrontCarousel";
import { DeliveryAvailability } from "../../components/DeliveryAvailability";
import { GoogleRating } from "../../components/GoogleRating";
import { StoreFrontFooter } from "../../components/StoreFrontFooter";
import { CookieConsent } from "../../components/CookieConsent";
import placeholder_products from "../../assets/images/placeholder_products.png";
import supportAvatar from "../../assets/images/support_avatar.png";
import {
    Container,
    Content,
    ProductGrid,
    EmptyState,
    DeliverySession,
    SessionTitle,
    SessionContent,
    ReviewSession,
    FloatingWhatsAppButton,
    WhatsAppBubble,
    WhatsAppAvatarWrapper
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
    banner_mobile?: string | null;
    banner_mobile_2?: string | null;
    banner_mobile_3?: string | null;
    schedules?: Schedule[];
    phone_number?: string;
    google_rating_value: number | null;
    google_rating_count: number | null;
    google_rating_url: string | null;
}

export function StoreFront() {
    const { slug, categorySlug } = useParams<{ slug: string; categorySlug?: string }>();
    const { addToCart } = useCart();
    const { trackPageView, trackViewItemList } = useGTM();
    const [products, setProducts] = useState<any[]>([]);
    const [totalProducts, setTotalProducts] = useState(0);
    const [store, setStore] = useState<Store | null>(null);
    const [showLoader, setShowLoader] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(12);
    const [storeCarousels, setStoreCarousels] = useState<IStoreCarousel[]>([]);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 800);
    const productsSectionRef = useRef<HTMLDivElement>(null);

    const loadAvailableProducts = async (slug: string, page: number, pageSize: number, categorySlug?: string) => {
        try {
            setError(null);
            const { data: { products, total, store } } = await listStoreFrontProducts(slug, page, pageSize, "", categorySlug);
            // Salvar store_id, store_name, phone_number e schedules no sessionStorage para uso no checkout e PDP
            if (store?.id) {
                sessionStorage.setItem('storefront_store_id', store.id);
            }
            if (store?.name) {
                sessionStorage.setItem('storefront_store_name', store.name);
            }
            if (store?.phone_number) {
                sessionStorage.setItem('storefront_store_phone', store.phone_number);
            }
            if (store?.schedules) {
                sessionStorage.setItem('storefront_store_schedules', JSON.stringify(store.schedules));
            }
            if (store?.max_delivery_days_advance) {
                sessionStorage.setItem('storefront_max_delivery_days_advance', String(store.max_delivery_days_advance));
            }

            if (store.logo) {
                sessionStorage.setItem('storefront_store_logo', store.logo);
            }
            
            setProducts(products);
            setTotalProducts(total);
            setStore(store);
            
            // GTM - Track View Item List quando produtos são carregados
            if (products && products.length > 0) {
                const listName = categorySlug 
                    ? `Categoria: ${categorySlug}` 
                    : 'Página Inicial';
                trackViewItemList(products, listName);
            }
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
        window.scrollTo(0, 0);
        setPage(1);
        
        // GTM - Track Page View
        const pageTitle = categorySlug 
            ? `Categoria: ${categorySlug}` 
            : 'Página Inicial';
        trackPageView(pageTitle);
    }, [categorySlug, trackPageView]);

    useEffect(() => {
        if (!slug) return;
        
        setShowLoader(true);
        loadAvailableProducts(slug, page, pageSize, categorySlug).then(() => {
            setTimeout(() => {
                setShowLoader(false);
                // Scroll suave até a seção de produtos quando mudar de página (não na primeira carga)
                if (page > 1 && productsSectionRef.current) {
                    let yOffset = -150;
                    if (window.innerWidth > 700) {
                        yOffset = -70;
                    }
                    const element = productsSectionRef.current;
                    const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
                    window.scrollTo({ top: y, behavior: 'smooth' });
                }
            }, 350);
        });

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [slug, page, pageSize, categorySlug]);

    useEffect(() => {
        if (!slug || categorySlug) return;
        listStorefrontCarousels(slug)
            .then(data => setStoreCarousels(data))
            .catch(() => setStoreCarousels([]));
    }, [slug, categorySlug]);

    useEffect(() => {
        function handleResize() {
            const width = window.innerWidth;
            setIsMobile(width < 800);
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
        addToCart({ ...product, price }, quantity);
    };

    const handleWhatsAppClick = () => {
        const storePhoneNumber = sessionStorage.getItem('storefront_store_phone') || '';
        const cleanNumber = storePhoneNumber.replace(/[^0-9]/g, '');
        const formattedNumber = cleanNumber.startsWith('55') ? cleanNumber : `55${cleanNumber}`;
        
        const message = `Olá! Visitei sua loja online e gostaria de fazer um pedido.`;
        const whatsappUrl = `https://wa.me/${formattedNumber}?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, "_blank");
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
            {!categorySlug && store && (() => {
                const desktopBanners = [store.banner, store.banner_2, store.banner_3].filter(Boolean) as string[];
                const mobileBanners = [store.banner_mobile, store.banner_mobile_2, store.banner_mobile_3].filter(Boolean) as string[];
                const banners = isMobile && mobileBanners.length > 0 ? mobileBanners : desktopBanners;

                return (
                    <BannerCarousel
                        banners={banners}
                        storeName={store.name}
                    />
                );
            })()}

            <Content>
                <Loader show={showLoader} />

                {!showLoader && products.length === 0 && (
                    <EmptyState>
                        <FontAwesomeIcon icon={faSearch as any} />
                        <h3>Nenhum produto encontrado</h3>
                        <p>Tente buscar por outro termo</p>
                    </EmptyState>
                )}

                {!showLoader && !categorySlug && storeCarousels.map(carousel => (
                    <StorefrontCarousel key={carousel.id} carousel={carousel} />
                ))}

                {!showLoader && products.length > 0 && (
                    <div ref={productsSectionRef}>
                        <h2 className="section-title">Nossos <strong>Produtos</strong></h2>
                        <ProductGrid>
                            {products.map((product) => (
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
                    </div>
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
            
            {store?.phone_number && (
                <FloatingWhatsAppButton onClick={handleWhatsAppClick} aria-label="Entrar em contato via WhatsApp">
                    <WhatsAppBubble className="whatsapp-bubble">
                        <strong>Precisa de ajuda?</strong>
                        <span>
                            <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.148.198 2.095 3.2 5.076 4.487.71.306 1.263.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                                <path d="M12.004 2.003c-5.514 0-9.997 4.483-9.997 9.997 0 1.762.462 3.484 1.34 5.003l-1.425 5.201 5.325-1.397a9.958 9.958 0 004.757 1.211h.005c5.514 0 9.997-4.483 9.997-9.997 0-2.67-1.04-5.182-2.928-7.07a9.938 9.938 0 00-7.074-2.948zm0 18.187h-.004a8.194 8.194 0 01-4.176-1.14l-.3-.178-3.16.829.843-3.08-.195-.316a8.183 8.183 0 01-1.259-4.395c0-4.523 3.68-8.203 8.204-8.203a8.148 8.148 0 015.804 2.406 8.148 8.148 0 012.398 5.802c0 4.523-3.68 8.203-8.155 8.203z" />
                            </svg>
                            Fale com um atendente
                        </span>
                    </WhatsAppBubble>
                    <WhatsAppAvatarWrapper className="whatsapp-avatar">
                        <img src={supportAvatar} alt="Suporte via WhatsApp" />
                        <span className="whatsapp-status-dot" />
                    </WhatsAppAvatarWrapper>
                </FloatingWhatsAppButton>
            )}
            
            <StoreFrontFooter />
            <CookieConsent />
        </Container>
    );
}
