import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart, faArrowLeft, faSearch } from "@fortawesome/free-solid-svg-icons";
import { useCart } from "../../contexts/CartContext";
import { useContext, useState, useEffect, useRef } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { listStoreFrontProducts } from "../../services/productService";
import {
    Header,
    LogoContainer,
    Logo,
    StoreName,
    HeaderActions,
    BackButton,
    CartButton,
    CartBadge,
    SearchContainer,
    SearchInput,
    SearchDropdown,
    SearchResultItem,
    SearchResultImage,
    SearchResultInfo,
    SearchResultName,
    SearchResultPrice,
    EmptySearchResults,
    SearchLoader
} from "./style";

interface StoreFrontHeaderProps {
    showBackButton?: boolean;
    backButtonText?: string;
    backButtonPath?: string;
    showCartButton?: boolean;
    onLogoClick?: () => void;
    logoSrc?: string;
    storeName?: string;
    slug?: string;
    searchTerm?: string;
    onSearchChange?: (value: string) => void;
    showSearch?: boolean;
}

export function StoreFrontHeader({
    showBackButton = false,
    backButtonText = "Voltar",
    backButtonPath = "/",
    showCartButton = false,
    onLogoClick,
    logoSrc: customLogoSrc,
    storeName: customStoreName,
    slug,
    searchTerm = "",
    onSearchChange,
    showSearch = false
}: StoreFrontHeaderProps) {
    const navigate = useNavigate();
    const { cartCount } = useCart();
    const { storeData } = useContext(AuthContext);
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [isSearching, setIsSearching] = useState(false);
    const searchRef = useRef<HTMLDivElement>(null);
    const [internalSearchTerm, setInternalSearchTerm] = useState(searchTerm);
    const logoFromStorage = localStorage.getItem('storefront_store_logo');
    const storeNameFromStorage = localStorage.getItem('storefront_store_name');

    // Usar logo customizado ou da loja se disponível, caso contrário usar logo mocada
    const logoSrc = customLogoSrc || storeData?.logo || logoFromStorage;
    const storeName = customStoreName || storeData?.name || storeNameFromStorage || "";

    // Realizar busca quando o usuário digita
    useEffect(() => {
        const timeoutId = setTimeout(async () => {
            if (internalSearchTerm.trim() && slug) {
                setIsSearching(true);
                try {
                    const { data } = await listStoreFrontProducts(slug, 1, 10, internalSearchTerm);
                    setSearchResults(data.products.filter((p: any) => p.enabled && p.stock > 0));
                    setShowDropdown(true);
                } catch (error) {
                    console.error('Erro ao buscar produtos:', error);
                    setSearchResults([]);
                } finally {
                    setIsSearching(false);
                }
            } else {
                setSearchResults([]);
                setShowDropdown(false);
            }
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [internalSearchTerm, slug]);

    // Fechar dropdown ao clicar fora
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setShowDropdown(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

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

    const handleProductClick = (productId: string) => {
        setShowDropdown(false);
        setInternalSearchTerm("");
        if (onSearchChange) {
            onSearchChange("");
        }
        if (slug) {
            navigate(`/${slug}/produto/${productId}`);
        }
    };

    const handleSearchInputChange = (value: string) => {
        setInternalSearchTerm(value);
        if (onSearchChange) {
            onSearchChange(value);
        }
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(price);
    };

    return (
        <Header>
            <LogoContainer onClick={handleLogoClick}>
                <Logo src={logoSrc as string} alt={storeName} />
                <StoreName>{storeName}</StoreName>
            </LogoContainer>
            {showSearch && (
                <SearchContainer ref={searchRef}>
                    <SearchInput
                        placeholder="Buscar produtos..."
                        value={internalSearchTerm}
                        onChange={(e) => handleSearchInputChange(e.target.value)}
                        onFocus={() => internalSearchTerm.trim() && setShowDropdown(true)}
                    />
                    {showDropdown && (
                        <SearchDropdown>
                            {isSearching ? (
                                <SearchLoader>
                                    <FontAwesomeIcon icon={faSearch as any} spin />
                                    <span>Buscando produtos...</span>
                                </SearchLoader>
                            ) : searchResults.length > 0 ? (
                                searchResults.map((product) => (
                                    <SearchResultItem
                                        key={product.id}
                                        onClick={() => handleProductClick(product.id)}
                                    >
                                        <SearchResultImage
                                            src={product.image || '/placeholder_products.png'}
                                            alt={product.name}
                                        />
                                        <SearchResultInfo>
                                            <SearchResultName>{product.name}</SearchResultName>
                                            <SearchResultPrice>{formatPrice(product.price)}</SearchResultPrice>
                                        </SearchResultInfo>
                                    </SearchResultItem>
                                ))
                            ) : (
                                <EmptySearchResults>
                                    <FontAwesomeIcon icon={faSearch as any} />
                                    <span>Nenhum produto encontrado</span>
                                </EmptySearchResults>
                            )}
                        </SearchDropdown>
                    )}
                </SearchContainer>
            )}
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
    );
}
