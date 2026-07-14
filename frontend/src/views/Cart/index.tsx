import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart, faTrash, faPlus, faMinus, faArrowRight, faExclamationCircle, faTag, faExclamationTriangle, faTimes } from "@fortawesome/free-solid-svg-icons";
import { useCart } from "../../contexts/CartContext";
import { useGTM } from "../../hooks/useGTM";
import { StoreFrontHeader } from "../../components/StoreFrontHeader";
import { FreightCalculator } from "../../components/FreightCalculator";
import { StockValidationModal } from "../../components/StockValidationModal";
import { stockService, InvalidStockItem } from "../../services/stockService";
import { validateCoupon, getCouponErrorMessage } from "../../services/couponService";
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
    CouponSection,
    CouponTitle,
    CouponForm,
    CouponInput,
    CouponButton,
    CouponErrorBox,
    CouponErrorText,
    AppliedCouponBox,
    AppliedCouponInfo,
    RemoveCouponButton,
} from "./style";

export function Cart() {
    const navigate = useNavigate();
    const { slug } = useParams<{ slug: string }>();
    const { trackPageView, trackViewCart, trackRemoveFromCart } = useGTM();
    const {
        cartItems,
        cartTotal,
        observations,
        deliveryInfo,
        isDeliveryCalculated,
        appliedCoupon,
        updateQuantity,
        removeFromCart,
        setObservations,
        applyCoupon,
        removeCoupon,
    } = useCart();

    const [isStockModalOpen, setIsStockModalOpen] = useState(false);
    const [invalidStockItems, setInvalidStockItems] = useState<InvalidStockItem[]>([]);
    const [isValidatingStock, setIsValidatingStock] = useState(false);
    
    // Coupon state
    const [couponCode, setCouponCode] = useState("");
    const [isValidatingCoupon, setIsValidatingCoupon] = useState(false);
    const [couponError, setCouponError] = useState("");

    useEffect(() => {
        window.scrollTo(0, 0);
        // GTM - Track Page View
        trackPageView('Carrinho');
    }, [trackPageView]);

    // GTM - Track View Cart
    useEffect(() => {
        if (cartItems.length > 0) {
            trackViewCart(cartItems, cartTotal);
        }
    }, [cartItems, cartTotal, trackViewCart]);

    const deliveryFee = deliveryInfo?.fee ?? 0;
    const couponDiscount = appliedCoupon?.discount_amount ?? 0;
    const totalWithDelivery = cartTotal + deliveryFee - couponDiscount;

    // Re-valida o cupom aplicado sempre que o total do carrinho mudar,
    // pois a remoção/redução de itens pode fazer o pedido deixar de atender
    // as regras do cupom (valor mínimo, etc).
    useEffect(() => {
        if (!appliedCoupon) return;

        const storeId = sessionStorage.getItem('storefront_store_id');
        if (!storeId) return;

        let isCurrent = true;

        const revalidate = async () => {
            try {
                const response = await validateCoupon({
                    code: appliedCoupon.code,
                    store_id: storeId,
                    orderTotal: cartTotal
                });

                if (!isCurrent) return;

                if (response.data.valid) {
                    if (response.data.discount_amount !== appliedCoupon.discount_amount) {
                        applyCoupon({
                            ...appliedCoupon,
                            discount_amount: response.data.discount_amount!
                        });
                    }
                } else {
                    removeCoupon();
                }
            } catch {
                if (isCurrent) removeCoupon();
            }
        };

        revalidate();

        return () => {
            isCurrent = false;
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [cartTotal]);

    const handleApplyCoupon = async () => {
        if (!couponCode.trim()) {
            setCouponError("Digite um código de cupom");
            return;
        }

        const storeId = sessionStorage.getItem('storefront_store_id');
        if (!storeId) {
            setCouponError("Não foi possível identificar a loja");
            return;
        }

        setIsValidatingCoupon(true);
        setCouponError("");

        try {
            const response = await validateCoupon({
                code: couponCode.toUpperCase().trim(),
                store_id: storeId,
                orderTotal: cartTotal
            });
            
            if (response.data.valid && response.data.coupon) {
                applyCoupon({
                    code: response.data.coupon.code,
                    coupon_id: response.data.coupon.id,
                    discount_amount: response.data.discount_amount!,
                });
                
                setCouponCode("");
            } else {
                setCouponError(getCouponErrorMessage(response.data.error_code));
            }
        } catch (error: any) {
            setCouponError(getCouponErrorMessage(error?.response?.data?.error_code || 'NETWORK_ERROR'));
        } finally {
            setIsValidatingCoupon(false);
        }
    };

    const handleRemoveCoupon = () => {
        removeCoupon();
        setCouponCode("");
        setCouponError("");
    };

    const handleGoToCheckout = async () => {
        if (cartItems.length === 0) return;
        if (!isDeliveryCalculated) return;

        setIsValidatingStock(true);

        try {
            const items = cartItems.map(item => ({
                store_product_id: item.id!,
                quantity: item.quantity
            }));

            const validationResult = await stockService.validateStock(items);

            if (validationResult.is_valid) {
                navigate(`/${slug}/checkout`);
            } else {
                setInvalidStockItems(validationResult.invalid_items);
                setIsStockModalOpen(true);
            }
        } catch (error) {
            console.error('Erro ao validar estoque:', error);
            alert('Erro ao validar estoque. Por favor, tente novamente.');
        } finally {
            setIsValidatingStock(false);
        }
    };

    const handleRemoveInvalidItems = (itemIds: string[]) => {
        itemIds.forEach(id => removeFromCart(id));
    };

    const handleRemoveFromCart = (item: any) => {
        // GTM - Track Remove from Cart
        trackRemoveFromCart(item, item.quantity);
        removeFromCart(item.id!);
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
                                        <RemoveButton onClick={() => handleRemoveFromCart(item)}>
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

                    {cartItems.length > 0 && (
                        <CouponSection>
                            <CouponTitle>
                                <FontAwesomeIcon icon={faTag as any} />
                                Cupom de Desconto
                            </CouponTitle>

                            {appliedCoupon ? (
                                <AppliedCouponBox>
                                    <AppliedCouponInfo>
                                        🎁 {appliedCoupon.code}
                                    </AppliedCouponInfo>
                                    <RemoveCouponButton type="button" onClick={handleRemoveCoupon}>
                                        <FontAwesomeIcon icon={faTimes as any} />
                                        Remover
                                    </RemoveCouponButton>
                                </AppliedCouponBox>
                            ) : (
                                <>
                                    <CouponForm>
                                        <CouponInput
                                            type="text"
                                            placeholder="Digite o código do cupom"
                                            value={couponCode}
                                            hasError={!!couponError}
                                            disabled={isValidatingCoupon}
                                            onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                                            onKeyDown={(e) => e.key === 'Enter' && handleApplyCoupon()}
                                        />
                                        <CouponButton
                                            type="button"
                                            onClick={handleApplyCoupon}
                                            disabled={isValidatingCoupon}
                                        >
                                            {isValidatingCoupon ? 'Aplicando...' : 'Aplicar'}
                                        </CouponButton>
                                    </CouponForm>

                                    {couponError && (
                                        <CouponErrorBox>
                                            <FontAwesomeIcon icon={faExclamationTriangle as any} />
                                            <CouponErrorText>{couponError}</CouponErrorText>
                                        </CouponErrorBox>
                                    )}
                                </>
                            )}
                        </CouponSection>
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
                    {appliedCoupon && couponDiscount > 0 && (
                        <SummaryRow>
                            <span>Desconto ({appliedCoupon.code}):</span>
                            <strong>-{convertMoney(couponDiscount)}</strong>
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
                            disabled={cartItems.length === 0 || !isDeliveryCalculated || isValidatingStock}
                        >
                            {isValidatingStock ? 'Validando...' : 'Ir para Checkout'}
                            {!isValidatingStock && <FontAwesomeIcon icon={faArrowRight as any} />}
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
                        disabled={cartItems.length === 0 || !isDeliveryCalculated || isValidatingStock}
                    >
                        {isValidatingStock ? 'Validando...' : 'Ir para Checkout'}
                        {!isValidatingStock && <FontAwesomeIcon icon={faArrowRight as any} />}
                    </CheckoutButton>
                </MobileCheckoutActions>
            </Content>

            <StockValidationModal
                isOpen={isStockModalOpen}
                onRequestClose={() => setIsStockModalOpen(false)}
                invalidItems={invalidStockItems}
                onRemoveItems={handleRemoveInvalidItems}
            />
        </Container>
    );
}
