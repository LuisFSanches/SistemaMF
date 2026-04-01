import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart, faTrash, faPlus, faMinus, faArrowRight, faExclamationCircle } from "@fortawesome/free-solid-svg-icons";
import { useCart } from "../../contexts/CartContext";
import { StoreFrontHeader } from "../../components/StoreFrontHeader";
import { FreightCalculator } from "../../components/FreightCalculator";
import placeholder_products from "../../assets/images/placeholder_products.png";
import { convertMoney } from "../../utils";
import { PrimaryButton } from "../../styles/global";
import {
    Container,
    Content,
    ProductsSection,
    ObservationsSection,
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
    StepperContainer,
    StepperWrapper,
    Step,
    StepCircle,
    StepLabel,
    StepSubLabel,
    FreightSection,
    CheckoutWarning,
    DesktopCheckoutActions,
    MobileCheckoutActions,
} from "./style";

export function Cart() {
    const navigate = useNavigate();
    const { slug } = useParams<{ slug: string }>();
    const {
        cartItems,
        cartTotal,
        observations,
        deliveryInfo,
        isDeliveryCalculated,
        updateQuantity,
        removeFromCart,
        setObservations
    } = useCart();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const deliveryFee = deliveryInfo?.fee ?? 0;
    const totalWithDelivery = cartTotal + deliveryFee;

    const handleGoToCheckout = () => {
        if (cartItems.length === 0) return;
        if (!isDeliveryCalculated) return;
        navigate(`/${slug}/checkout`);
    };

    const steps = ["Carrinho", "Informações do Pedido", "Pagamento"];
    const currentStep = 1;

    return (
        <Container>
            <StoreFrontHeader 
                showBackButton 
                backButtonText="Voltar às Compras"
                backButtonPath={`/${slug}`}
                slug={slug}
            />

            <StepperContainer>
                <StepperWrapper>
                    {steps.map((stepName, index) => {
                        const stepNumber = index + 1;
                        const isActive = currentStep === stepNumber;
                        const isCompleted = currentStep > stepNumber;
                        
                        return (
                            <Step 
                                key={stepNumber} 
                                active={isActive} 
                                completed={isCompleted}
                                clickable={false}
                            >
                                <StepCircle active={isActive} completed={isCompleted}>
                                    {isCompleted ? '✓' : stepNumber}
                                </StepCircle>
                                <StepLabel active={isActive}>{stepName}</StepLabel>
                                <StepSubLabel>
                                    {stepNumber === 1 && 'Revise seus itens'}
                                    {stepNumber === 2 && 'Dados de entrega'}
                                    {stepNumber === 3 && 'Finalize o pedido'}
                                </StepSubLabel>
                            </Step>
                        );
                    })}
                </StepperWrapper>
            </StepperContainer>

            <Content>
                <ProductsSection>
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
                </ProductsSection>

                {cartItems.length > 0 && (
                    <ObservationsSection>
                        <SectionTitle style={{ marginBottom: '10px' }}>
                            Observações
                        </SectionTitle>
                        <ObservationsField>
                            <Textarea
                                placeholder={"Adicione observações sobre seu pedido."}
                                value={observations}
                                onChange={(e) => setObservations(e.target.value)}
                                rows={8}
                            />
                            <p>Demais informações como o cartão de mensagem serão preenchidos no checkout.</p>
                        </ObservationsField>
                    </ObservationsSection>
                )}

                <OrderSummary>
                    <SectionTitle>Resumo do Pedido</SectionTitle>

                    {cartItems.length > 0 && (
                        <FreightSection>
                            <FreightCalculator />
                        </FreightSection>
                    )}

                    <SummaryRow>
                        <span>Subtotal:</span>
                        <strong>{convertMoney(cartTotal)}</strong>
                    </SummaryRow>
                    {isDeliveryCalculated && deliveryInfo && (
                        <SummaryRow>
                            <span>Taxa de Entrega:</span>
                            <strong>{convertMoney(deliveryFee)}</strong>
                        </SummaryRow>
                    )}
                    {isDeliveryCalculated && deliveryInfo && cartTotal > 0 && (
                        <SummaryRow className="total">
                            <span>Total:</span>
                            <span>{convertMoney(totalWithDelivery)}</span>
                        </SummaryRow>
                    )}

                    {cartItems.length > 0 && !isDeliveryCalculated && (
                        <DesktopCheckoutActions>
                            <CheckoutWarning>
                                <FontAwesomeIcon icon={faExclamationCircle as any} />
                                Calcule o frete para continuar
                            </CheckoutWarning>
                        </DesktopCheckoutActions>
                    )}

                    <DesktopCheckoutActions>
                        <CheckoutButton 
                            onClick={handleGoToCheckout}
                            disabled={cartItems.length === 0 || !isDeliveryCalculated}
                        >
                            Ir para Checkout
                            <FontAwesomeIcon icon={faArrowRight as any} />
                        </CheckoutButton>
                    </DesktopCheckoutActions>
                </OrderSummary>

                <MobileCheckoutActions>
                    {cartItems.length > 0 && !isDeliveryCalculated && (
                        <CheckoutWarning>
                            <FontAwesomeIcon icon={faExclamationCircle as any} />
                            Calcule o frete para continuar
                        </CheckoutWarning>
                    )}
                    <CheckoutButton 
                        onClick={handleGoToCheckout}
                        disabled={cartItems.length === 0 || !isDeliveryCalculated}
                    >
                        Ir para Checkout
                        <FontAwesomeIcon icon={faArrowRight as any} />
                    </CheckoutButton>
                </MobileCheckoutActions>
            </Content>
        </Container>
    );
}
