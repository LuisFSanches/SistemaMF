import { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { OrderDetailsView } from "../../components/OrderDetailsView";
import { OrderStatusStep } from "../../components/OrderStatusStepper";
import { getMercadoPagoPaymentStatus } from "../../services/mercadoPagoService";
import { rawTelephone } from "../../utils";
import { useCart } from "../../contexts/CartContext";
import { useGTM } from "../../hooks/useGTM";
import { IPaymentSuccessResponse } from "../../interfaces/IPaymentSuccessResponse";

type ResultStatus = 'approved' | 'failure' | 'pending' | 'in_progress' | 'in_delivery' | 'done';

export function CheckoutResult() {
    const navigate = useNavigate();
    const { slug, status: resultStatus } = useParams<{ slug: string; status: string }>();
    const [searchParams] = useSearchParams();
    const { clearCart } = useCart();
    const { trackPageView, trackPurchase } = useGTM();
    
    const [showLoader, setShowLoader] = useState(true);
    const [orderData, setOrderData] = useState<IPaymentSuccessResponse | null>(null);
    const [orderStep, setOrderStep] = useState<OrderStatusStep>('validating');
    const [purchaseTracked, setPurchaseTracked] = useState(false);

    useEffect(() => {
        window.scrollTo(0, 0);
        // GTM - Track Page View
        trackPageView('Resultado do Checkout');
    }, [trackPageView]);

    // Parâmetros retornados pelo Mercado Pago
    const paymentId = searchParams.get('payment_id');

    const initialStatus: ResultStatus = (resultStatus as ResultStatus) || 'pending';
    const [status, setStatus] = useState<ResultStatus>(initialStatus);

    useEffect(() => {
        let attemptCount = 0;
        const maxAttempts = 5;
        const intervalTime = 10000;
        let intervalId: NodeJS.Timeout;

        const fetchPaymentDetails = async () => {
            if (paymentId && slug) {
                try {
                    attemptCount++;
                    
                    const details = await getMercadoPagoPaymentStatus(paymentId, slug);
                    setOrderData(details);
                    setStatus(details.order.status as ResultStatus);

                    // Se o pagamento foi aprovado, para de fazer requisições
                    if (details.order.status === 'approved' ||
                        details.order.status === 'in_progress' ||
                        details.order.status === 'in_delivery' ||
                        details.order.status === 'done') {
                        setOrderStep(details.order.status as OrderStatusStep);
                        clearInterval(intervalId);
                        setShowLoader(false);
                    } else if (attemptCount >= maxAttempts) {
                        clearInterval(intervalId);
                        setShowLoader(false);
                    }
                } catch (error) {
                    console.error("Erro ao buscar detalhes do pagamento:", error);
                    
                    if (attemptCount >= maxAttempts) {
                        clearInterval(intervalId);
                        setShowLoader(false);
                    }
                }
            } else {
                setShowLoader(false);
            }
        };

        const initialTimeout = setTimeout(() => {
            fetchPaymentDetails();
            
            intervalId = setInterval(() => {
                if (attemptCount < maxAttempts) {
                    fetchPaymentDetails();
                } else {
                    clearInterval(intervalId);
                }
            }, intervalTime);
        }, 2000);

        // Cleanup function
        return () => {
            clearTimeout(initialTimeout);
            if (intervalId) {
                clearInterval(intervalId);
            }
        };
    }, [paymentId, slug]);

    // Limpar carrinho quando chegar nas páginas de resultado
    useEffect(() => {
        clearCart();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // GTM - Track Purchase quando pagamento for aprovado
    useEffect(() => {
        if (orderData && status === 'approved' && !purchaseTracked) {
            const deliveryFee = orderData.financial?.delivery_fee || 0;
            const subtotal = orderData.financial?.subtotal || 0;
            
            trackPurchase(
                orderData.order.id.toString(),
                orderData.items,
                subtotal,
                deliveryFee,
                orderData.payment?.method_id || 'unknown'
            );
            
            setPurchaseTracked(true);
        }
    }, [orderData, status, purchaseTracked, trackPurchase]);

    const handleGoToStore = () => {
        navigate(`/${slug}`);
    };

    const handleTryAgain = () => {
        navigate(`/${slug}/carrinho`);
    };

    const handleContactStore = () => {
        if (orderData?.store?.phone_number) {
            const cleanPhone = rawTelephone(orderData.store.phone_number);
            const message = encodeURIComponent(
                `Olá! Gostaria de obter informações sobre meu pedido #${orderData?.order?.order_code}.`
            );
            const whatsappUrl = `https://wa.me/55${cleanPhone}?text=${message}`;
            window.open(whatsappUrl, '_blank');
        } else {
            navigate(`/${slug}`);
        }
    };

    return (
        <OrderDetailsView
            slug={slug}
            status={status}
            orderData={orderData}
            orderStep={orderStep}
            showLoader={showLoader}
            loadingMessage="Verificando status do pagamento..."
            onGoToStore={handleGoToStore}
            onTryAgain={handleTryAgain}
            onContactStore={handleContactStore}
        />
    );
}
