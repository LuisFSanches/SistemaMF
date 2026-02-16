import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWhatsapp, faPix } from "@fortawesome/free-brands-svg-icons";
import { faMoneyBill, faChevronLeft, faChevronRight, faCreditCard as faCardSolid } from "@fortawesome/free-solid-svg-icons";
import { useCart } from "../../contexts/CartContext";
import { getStoreFrontProductDetail } from "../../services/productService";
import { IStoreProductDetail } from "../../interfaces/IStoreProductDetail";
import { StoreFrontHeader } from "../../components/StoreFrontHeader";
import { StoreFrontFooter } from "../../components/StoreFrontFooter";
import { CategoryMenu } from "../../components/CategoryMenu";
import { Loader } from "../../components/Loader";
import { DeliveryAvailability } from "../../components/DeliveryAvailability";
import placeholder_products from "../../assets/images/placeholder_products.png";
import mercadoPagoLogo from "../../assets/images/mercado-pago-logo.png";
import {
    Container,
    Content,
    ProductContainer,
    ImageSection,
    ImageCarousel,
    MainImage,
    ThumbnailContainer,
    Thumbnail,
    CarouselButton,
    InfoSection,
    SideColumn,
    ProductTitle,
    ProductPrice,
    ProductUnity,
    ActionButtons,
    BuyNowButton,
    AddToCartButton,
    WhatsAppButton,
    DescriptionSection,
    SectionTitle,
    Description,
    PaymentSection,
    PaymentMethods,
    PaymentMethod,
    PaymentIcon,
    MercadoPagoInfo,
    MercadoPagoLogo,
    ObservationSection,
    ObservationText,
    CategoryBadge,
    CategoryGroup,
    CategoryContainer,
    StockInfo,
    ErrorContainer,
    ErrorMessage,
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

export function ProductDetail() {
    const { slug, productId } = useParams<{ slug: string; productId: string }>();
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const [product, setProduct] = useState<IStoreProductDetail | null>(null);
    const [showLoader, setShowLoader] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [quantity] = useState(1);
    const [storeSchedules, setStoreSchedules] = useState<Schedule[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [storeName, setStoreName] = useState<string | null>(null);

    const loadProductDetail = async (productId: string) => {
        try {
            setError(null);
            const { data } = await getStoreFrontProductDetail(productId);
            setProduct(data);
        } catch (err: any) {
            console.error('Erro ao carregar detalhes do produto:', err);
            if (err.response?.status === 404) {
                setError('Produto não encontrado');
            } else {
                setError('Erro ao carregar o produto. Tente novamente mais tarde.');
            }
        } finally {
            setTimeout(() => {
                setShowLoader(false);
            }, 350);
        }
    };

    useEffect(() => {
        if (productId) {
            setShowLoader(true);
            loadProductDetail(productId);
            
            // Carregar schedules e nome da loja do localStorage (salvos pelo StoreFront)
            const savedSchedules = localStorage.getItem('storefront_store_schedules');
            if (savedSchedules) {
                try {
                    setStoreSchedules(JSON.parse(savedSchedules));
                } catch (error) {
                    console.error('Erro ao carregar schedules do localStorage:', error);
                }
            }
            
            const savedStoreName = localStorage.getItem('storefront_store_name');
            if (savedStoreName) {
                setStoreName(savedStoreName);
            }
        }
    }, [productId]);

    const images = product
        ? [
              product.product.image,
              product.product.image_2,
              product.product.image_3,
          ].filter(Boolean) as string[]
        : [];

    if (images.length === 0 && product) {
        images.push(placeholder_products);
    }

    const handlePrevImage = () => {
        setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    };

    const handleNextImage = () => {
        setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    };

    const handleAddToCart = () => {
        if (!product) return;
        // Transformar o storeProduct em IProduct para o carrinho
        const cartProduct = {
            id: product.id,
            name: product.product.name,
            image: product.product.image || undefined,
            image_2: product.product.image_2 || undefined,
            image_3: product.product.image_3 || undefined,
            price: product.price,
            unity: product.product.unity,
            stock: product.stock,
            enabled: product.enabled,
        };
        addToCart(cartProduct, quantity);
    };

    const handleBuyNow = () => {
        if (!product) return;
        // Transformar o storeProduct em IProduct para o carrinho
        const cartProduct = {
            id: product.id,
            name: product.product.name,
            image: product.product.image || undefined,
            image_2: product.product.image_2 || undefined,
            image_3: product.product.image_3 || undefined,
            price: product.price,
            unity: product.product.unity,
            stock: product.stock,
            enabled: product.enabled,
        };
        addToCart(cartProduct, quantity);
        navigate(`/${slug}/checkout`);
    };

    const handleWhatsAppOrder = () => {
        if (!product) return;
        
        const storePhoneNumber = localStorage.getItem('storefront_store_phone') || '';
        const cleanNumber = storePhoneNumber.replace(/[^0-9]/g, '');
        const formattedNumber = cleanNumber.startsWith('55') ? cleanNumber : `55${cleanNumber}`;
        
        const message = `Olá! Gostaria de comprar:\n\n*${product.product.name}*\nQuantidade: ${quantity}\nPreço: R$ ${product.price.toFixed(2)}`;
        const whatsappUrl = `https://wa.me/${formattedNumber}?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, "_blank");
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        }).format(price);
    };

    if (showLoader) {
        return (
            <Container>
                <StoreFrontHeader showCartButton slug={slug} />
                <Content>
                    <Loader show={true} />
                </Content>
                <StoreFrontFooter />
            </Container>
        );
    }

    if (error || !product) {
        return (
            <Container>
                <StoreFrontHeader showCartButton slug={slug} />
                <Content>
                    <ErrorContainer>
                        <ErrorMessage>{error || 'Produto não encontrado'}</ErrorMessage>
                    </ErrorContainer>
                </Content>
                <StoreFrontFooter />
            </Container>
        );
    }

    return (
        <Container>
            <StoreFrontHeader 
                showCartButton 
                slug={slug}
                storeName={storeName || undefined}
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                showSearch={true}
            />
            <CategoryMenu 
                storeSlug={slug || ''} 
                selectedCategorySlug={undefined}
            />
            <Content>
                <ProductContainer>
                    <ImageSection>
                        <ImageCarousel>
                            {images.length > 1 && (
                                <CarouselButton onClick={handlePrevImage} position="left">
                                    <FontAwesomeIcon icon={faChevronLeft as any} />
                                </CarouselButton>
                            )}
                            <MainImage src={images[currentImageIndex]} alt={product.product.name} />
                            {images.length > 1 && (
                                <CarouselButton onClick={handleNextImage} position="right">
                                    <FontAwesomeIcon icon={faChevronRight as any} />
                                </CarouselButton>
                            )}
                        </ImageCarousel>
                        {images.length > 1 && (
                            <ThumbnailContainer>
                                {images.map((image, index) => (
                                    <Thumbnail
                                        key={index}
                                        src={image}
                                        alt={`${product.product.name} - ${index + 1}`}
                                        isActive={index === currentImageIndex}
                                        onClick={() => setCurrentImageIndex(index)}
                                    />
                                ))}
                            </ThumbnailContainer>
                        )}
                    </ImageSection>

                    <InfoSection>
                        <ProductTitle>{product.product.name}</ProductTitle>

                        <ProductPrice>
                            {formatPrice(product.price)}
                            <ProductUnity>/ {product.product.unity}</ProductUnity>
                        </ProductPrice>

                        {product.product.categories && product.product.categories.length > 0 && (
                            <CategoryContainer>
                                <CategoryGroup>
                                    {product.product.categories.map((cat) => (
                                        <CategoryBadge key={cat.category.id}>
                                            {cat.category.name}
                                        </CategoryBadge>
                                    ))}
                                </CategoryGroup>
                                <StockInfo inStock={product.stock > 0}>
                                    {product.stock > 0 ? 'Em estoque' : 'Fora de estoque'}
                                </StockInfo>
                            </CategoryContainer>
                        )}

                        {product.enabled && product.visible_for_online_store && product.stock > 0 && (
                            <ActionButtons>
                                <BuyNowButton onClick={handleBuyNow}>
                                    Comprar Agora
                                </BuyNowButton>
                                <AddToCartButton onClick={handleAddToCart}>
                                    Adicionar ao Carrinho
                                </AddToCartButton>
                                <WhatsAppButton onClick={handleWhatsAppOrder}>
                                    <FontAwesomeIcon icon={faWhatsapp as any} />
                                    Comprar pelo WhatsApp
                                </WhatsAppButton>
                            </ActionButtons>
                        )}

                        {product.product.description && (
                            <DescriptionSection>
                                <SectionTitle>Descrição</SectionTitle>
                                <Description>{product.product.description}</Description>
                            </DescriptionSection>
                        )}
                    </InfoSection>

                    <SideColumn>
                        {storeSchedules.length > 0 && (
                            <>
                                <SectionTitle>Disponibilidade de <strong>Entrega</strong></SectionTitle>
                                <DeliveryAvailability schedules={storeSchedules} isPDP={true} />
                            </>
                        )}

                        <PaymentSection>
                            <SectionTitle>Formas de Pagamento</SectionTitle>
                            <PaymentMethods>
                                <PaymentMethod>
                                    <PaymentIcon className="pix">
                                        <FontAwesomeIcon icon={faPix as any} />
                                    </PaymentIcon>
                                    <span>PIX</span>
                                </PaymentMethod>
                                <PaymentMethod>
                                    <PaymentIcon className="card">
                                        <FontAwesomeIcon icon={faCardSolid as any} />
                                    </PaymentIcon>
                                    <span>Cartão</span>
                                </PaymentMethod>
                                <PaymentMethod>
                                    <PaymentIcon className="cash">
                                        <FontAwesomeIcon icon={faMoneyBill as any} />
                                    </PaymentIcon>
                                    <span>Saldo da conta</span>
                                </PaymentMethod>
                            </PaymentMethods>
                            <MercadoPagoInfo>
                                <span>Pagamento processado por</span>
                                <MercadoPagoLogo src={mercadoPagoLogo} alt="Mercado Pago" />
                            </MercadoPagoInfo>
                        </PaymentSection>

                        <ObservationSection>
                            <SectionTitle>Observações Importantes</SectionTitle>
                            <ObservationText>
                                • Este produto será preparado pela <strong>Loja {localStorage.getItem('storefront_store_name') || 'parceira'}</strong>
                            </ObservationText>
                            <ObservationText>
                                • As características do produto podem variar ligeiramente em relação às imagens, 
                                pois trabalhamos com produtos naturais e artesanais.
                            </ObservationText>
                        </ObservationSection>
                    </SideColumn>
                </ProductContainer>
            </Content>
            <StoreFrontFooter />
        </Container>
    );
}
