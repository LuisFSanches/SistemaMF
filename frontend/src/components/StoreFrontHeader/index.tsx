import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { useCart } from "../../contexts/CartContext";
import { useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import logoFull from "../../assets/images/original_logo.png";
import {
    Header,
    Logo,
    HeaderActions,
    BackButton,
    CartButton,
    CartBadge
} from "./style";

interface StoreFrontHeaderProps {
    showBackButton?: boolean;
    backButtonText?: string;
    backButtonPath?: string;
    showCartButton?: boolean;
    onLogoClick?: () => void;
}

export function StoreFrontHeader({
    showBackButton = false,
    backButtonText = "Voltar",
    backButtonPath = "/",
    showCartButton = false,
    onLogoClick
}: StoreFrontHeaderProps) {
    const navigate = useNavigate();
    const { cartCount } = useCart();
    const { storeData } = useContext(AuthContext);

    // Usar logo da loja se disponível, caso contrário usar logo mocada
    const logoSrc = storeData?.logo || logoFull;

    const handleLogoClick = () => {
        if (onLogoClick) {
            onLogoClick();
        } else {
            navigate("/");
        }
    };

    const handleBackClick = () => {
        navigate(backButtonPath);
    };

    const handleCartClick = () => {
        navigate("/carrinho");
    };

    return (
        <Header>
            <Logo src={logoSrc} alt="Mirai Flores" onClick={handleLogoClick} />
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
