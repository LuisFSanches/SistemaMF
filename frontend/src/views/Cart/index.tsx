import { useNavigate, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart, faTrash, faPlus, faMinus, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { useCart } from "../../contexts/CartContext";
import { StoreFrontHeader } from "../../components/StoreFrontHeader";
import placeholder_products from "../../assets/images/placeholder_products.png";
import { convertMoney } from "../../utils";
import { PrimaryButton } from "../../styles/global";
import {
    Container,
    Content,
    CartSection,
    SectionTitle,
    CartItem,
    CartItemImage,
    CartItemInfo,
    CartItemName,
    CartItemPrice,
    CartItemActions,
    QuantityControl,
    QuantityButton,
    QuantityDisplay,
    RemoveButton,
    EmptyCart,
    OrderSummary,
    SummaryRow,
    CheckoutButton,
    ObservationsField,
    Textarea,
} from "./style";

export function Cart() {
    const navigate = useNavigate();
    const { slug } = useParams<{ slug: string }>();
    const {
        cartItems,
        cartTotal,
        observations,
        updateQuantity,
        removeFromCart,
        setObservations
    } = useCart();

    const DEFAULT_DELIVERY_FEE = 8.0;
    const deliveryFee = DEFAULT_DELIVERY_FEE;
    const totalWithDelivery = cartTotal + deliveryFee;

    const handleGoToCheckout = () => {
        if (cartItems.length === 0) return;
        navigate(`/${slug}/checkout`);
    };

    return (
        <Container>
            <StoreFrontHeader 
                showBackButton 
                backButtonText="Voltar às Compras"
                backButtonPath={`/${slug}`}
                slug={slug}
            />

            <Content>
                <CartSection>
                    <SectionTitle>
                        <FontAwesomeIcon icon={faShoppingCart as any} />
                        Seu Carrinho
                    </SectionTitle>

                    {cartItems.length === 0 ? (
                        <EmptyCart>
                            <FontAwesomeIcon icon={faShoppingCart as any} />
                            <h3>Seu carrinho está vazio</h3>
                            <p>Adicione produtos para continuar</p>
                            <PrimaryButton onClick={() => navigate(`/${slug}`)}>
                                Ir às Compras
                            </PrimaryButton>
                        </EmptyCart>
                    ) : (
                        <>
                            {cartItems.map((item) => (
                                <CartItem key={item.id}>
                                    <CartItemImage
                                        src={item.image || placeholder_products}
                                        alt={item.name}
                                    />
                                    <CartItemInfo>
                                        <CartItemName>{item.name}</CartItemName>
                                        <CartItemPrice>
                                            {convertMoney((item.price || 0) * item.quantity)}
                                        </CartItemPrice>
                                    </CartItemInfo>
                                    <CartItemActions>
                                        <QuantityControl>
                                            <QuantityButton
                                                onClick={() => updateQuantity(item.id!, item.quantity - 1)}
                                                disabled={item.quantity <= 1}
                                            >
                                                <FontAwesomeIcon icon={faMinus as any} />
                                            </QuantityButton>
                                            <QuantityDisplay>{item.quantity}</QuantityDisplay>
                                            <QuantityButton
                                                onClick={() => updateQuantity(item.id!, item.quantity + 1)}
                                            >
                                                <FontAwesomeIcon icon={faPlus as any} />
                                            </QuantityButton>
                                        </QuantityControl>
                                        <RemoveButton onClick={() => removeFromCart(item.id!)}>
                                            <FontAwesomeIcon icon={faTrash as any} />
                                        </RemoveButton>
                                    </CartItemActions>
                                </CartItem>
                            ))}
                        </>
                    )}
                </CartSection>

                {cartItems.length > 0 && (
                    <CartSection>
                        <SectionTitle>Observações</SectionTitle>
                        <ObservationsField>
                            <Textarea
                                placeholder="Adicione observações sobre seu pedido (opcional)"
                                value={observations}
                                onChange={(e) => setObservations(e.target.value)}
                                rows={8}
                            />
                            <p>Demais informações como o cartão de mensagem serão preenchidos no checkout.</p>
                        </ObservationsField>
                    </CartSection>
                )}

                <OrderSummary>
                    <SectionTitle>Resumo do Pedido</SectionTitle>
                    <SummaryRow>
                        <span>Subtotal:</span>
                        <strong>{convertMoney(cartTotal)}</strong>
                    </SummaryRow>
                    {cartTotal > 0 &&
                        <SummaryRow>
                            <span>Taxa de Entrega:</span>
                            <strong>{convertMoney(deliveryFee)}</strong>
                        </SummaryRow>
                    }
                    {cartTotal > 0 &&
                        <SummaryRow className="total">
                            <span>Total:</span>
                            <span>{convertMoney(totalWithDelivery)}</span>
                        </SummaryRow>
                    }
                    <CheckoutButton 
                        onClick={handleGoToCheckout}
                        disabled={cartItems.length === 0}
                    >
                        Ir para Checkout
                        <FontAwesomeIcon icon={faArrowRight as any} />
                    </CheckoutButton>
                </OrderSummary>
            </Content>
        </Container>
    );
}
