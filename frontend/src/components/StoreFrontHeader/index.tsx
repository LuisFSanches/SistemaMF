import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart, faArrowLeft, faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { useCart } from "../../contexts/CartContext";
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import logoFull from "../../assets/images/original_logo.png";
import {
    Header,
    BannerCarouselContainer,
    BannerSlide,
    Banner,
    CarouselButton,
    CarouselDots,
    CarouselDot,
    LogoContainer,
    Logo,
    StoreName,
    HeaderActions,
    BackButton,
    CartButton,
    CartBadge
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

interface StoreFrontHeaderProps {
    showBackButton?: boolean;
    backButtonText?: string;
    backButtonPath?: string;
    showCartButton?: boolean;
    onLogoClick?: () => void;
    store?: Store | null;
    slug?: string;
}

export function StoreFrontHeader({
    showBackButton = false,
    backButtonText = "Voltar",
    backButtonPath = "/",
    showCartButton = false,
    onLogoClick,
    store,
    slug
}: StoreFrontHeaderProps) {
    const navigate = useNavigate();
    const { cartCount } = useCart();
    const { storeData } = useContext(AuthContext);
    const [currentSlide, setCurrentSlide] = useState(0);

    // Usar logo da loja se disponível, caso contrário usar logo mocada
    const logoSrc = store?.logo || storeData?.logo || logoFull;
    const storeName = store?.name || storeData?.name || "Loja";
    
    // Filtrar banners não-nulos
    const banners = [
        store?.banner,
        store?.banner_2,
        store?.banner_3
    ].filter(Boolean) as string[];

    // Auto-play do carousel
    useEffect(() => {
        if (banners.length > 1) {
            const interval = setInterval(() => {
                setCurrentSlide((prev) => (prev + 1) % banners.length);
            }, 5000);
            return () => clearInterval(interval);
        }
    }, [banners.length]);

    const handleLogoClick = () => {
        if (onLogoClick) {
            onLogoClick();
        } else if (slug) {
            navigate(`/${slug}`);
        } else {
            navigate("/");
        }
    };

    const handleBackClick = () => {
        navigate(backButtonPath);
    };

    const handleCartClick = () => {
        if (slug) {
            navigate(`/${slug}/carrinho`);
        } else {
            navigate("/carrinho");
        }
    };

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % banners.length);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length);
    };

    const goToSlide = (index: number) => {
        setCurrentSlide(index);
    };

    return (
        <>
            <Header>
                <LogoContainer onClick={handleLogoClick}>
                    <Logo src={logoSrc} alt={storeName} />
                    <StoreName>{storeName}</StoreName>
                </LogoContainer>
                <HeaderActions>
                {showBackButton && (
                    <BackButton onClick={handleBackClick}>
                        <FontAwesomeIcon icon={faArrowLeft as any} />
                        {backButtonText}
                    </BackButton>
                )}
                {showCartButton && (
                    <CartButton onClick={handleCartClick}>
                        <FontAwesomeIcon icon={faShoppingCart as any} />
                        {cartCount > 0 && <CartBadge>{cartCount}</CartBadge>}
                    </CartButton>
                )}
                </HeaderActions>
            </Header>
            {banners.length > 0 && (
                <BannerCarouselContainer>
                    {banners.map((banner, index) => (
                        <BannerSlide key={index} isActive={currentSlide === index}>
                            <Banner src={banner} alt={`${storeName} Banner ${index + 1}`} />
                        </BannerSlide>
                    ))}
                    
                    {banners.length > 1 && (
                        <>
                            <CarouselButton direction="left" onClick={prevSlide}>
                                <FontAwesomeIcon icon={faChevronLeft as any} />
                            </CarouselButton>
                            <CarouselButton direction="right" onClick={nextSlide}>
                                <FontAwesomeIcon icon={faChevronRight as any} />
                            </CarouselButton>
                            
                            <CarouselDots>
                                {banners.map((_, index) => (
                                    <CarouselDot
                                        key={index}
                                        isActive={currentSlide === index}
                                        onClick={() => goToSlide(index)}
                                    />
                                ))}
                            </CarouselDots>
                        </>
                    )}
                </BannerCarouselContainer>
            )}
            
        </>
    );
}
