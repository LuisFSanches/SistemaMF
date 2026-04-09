import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { OrderDetailsView } from "../../components/OrderDetailsView";
import { OrderStatusStep } from "../../components/OrderStatusStepper";
import { getOrderStatus } from "../../services/orderService";
import { rawTelephone } from "../../utils";
import { useGTM } from "../../hooks/useGTM";
import { IPaymentSuccessResponse } from "../../interfaces/IPaymentSuccessResponse";

type ResultStatus = 'approved' | 'failure' | 'pending' | 'in_progress' | 'in_delivery' | 'done';

export function OrderStatusPage() {
    const navigate = useNavigate();
    const { slug, orderId } = useParams<{ slug: string; orderId: string }>();
    const { trackPageView } = useGTM();
    
    const [showLoader, setShowLoader] = useState(true);
    const [orderData, setOrderData] = useState<IPaymentSuccessResponse | null>(null);
    const [status, setStatus] = useState<ResultStatus>('pending');
    const [orderStep, setOrderStep] = useState<OrderStatusStep>('validating');
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        window.scrollTo(0, 0);
        // GTM - Track Page View
        trackPageView('Status do Pedido');
    }, [trackPageView]);

    useEffect(() => {
        const fetchOrderStatus = async () => {
            if (!orderId) {
                setError('ID do pedido não fornecido');
                setShowLoader(false);
                return;
            }

            try {
                setShowLoader(true);
                const data = await getOrderStatus(orderId);
                
                setOrderData(data);
                setStatus(data.order.status as ResultStatus);
                setOrderStep(data.order.status as OrderStatusStep);
                setError(null);
            } catch (err) {
                console.error("Erro ao buscar detalhes do pedido:", err);
                setError('Não foi possível encontrar o pedido. Verifique se o link está correto.');
                setStatus('failure');
            } finally {
                setShowLoader(false);
            }
        };

        fetchOrderStatus();
    }, [orderId]);

    const handleGoToStore = () => {
        navigate(`/${slug}`);
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

    // Se houver erro, exibe uma mensagem amigável
    if (error && !showLoader) {
        return (
            <OrderDetailsView
                slug={slug}
                status="failure"
                orderData={null}
                orderStep="validating"
                showLoader={false}
                onGoToStore={handleGoToStore}
                onContactStore={handleContactStore}
            />
        );
    }

    return (
        <OrderDetailsView
            slug={slug}
            status={status}
            orderData={orderData}
            orderStep={orderStep}
            showLoader={showLoader}
            loadingMessage="Carregando informações do pedido..."
            onGoToStore={handleGoToStore}
            onContactStore={handleContactStore}
        />
    );
}
