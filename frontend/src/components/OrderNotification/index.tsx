import { useEffect, useState } from 'react';
import { Container, AlertContent } from './style';
import { playNotificationSound, playDeliverySound, playPaymentConfirmedSound } from '../../utils/notificationSounds';

type Notification = {
    id: string;
    message: string;
    orderCode: string;
    clientName: string;
    deliveryMan?: string| null;
    isDelivery?: boolean;
    isPaymentConfirmed?: boolean;
    amount?: number;
    paymentType?: string;
};

export const OrderNotification = () => {
    const [notifications, setNotifications] = useState<Notification[]>([]);

    const addNotification = (
        message: string,
        orderCode: string,
        clientName: string,
        deliveryMan: string | null = null,
        isDelivery: boolean = false,
        isPaymentConfirmed: boolean = false,
        amount?: number,
        paymentType?: string
    ) => {
        const id = crypto.randomUUID();
        const newNotification = { 
            id, 
            message, 
            orderCode, 
            clientName, 
            deliveryMan, 
            isDelivery, 
            isPaymentConfirmed,
            amount,
            paymentType
        };
        setNotifications((prev) => [...prev, newNotification]);
        // Tocar som apropriado
        if (isPaymentConfirmed) {
            console.log('Playing payment confirmed sound');
            playPaymentConfirmedSound();
        } else if (isDelivery) {
            playDeliverySound();
        } else {
            playNotificationSound();
        }

        setTimeout(() => {
            setNotifications((prev) => prev.filter((n) => n.id !== id));
        }, 25000);
    };

    useEffect(() => {
        const handleNewOrder = (event: CustomEvent) => {
            addNotification(
                event.detail.message,
                event.detail.orderCode,
                event.detail.clientName,
                "",
                false
            );
        };

        const handleOrderDelivered = (event: CustomEvent) => {
            console.log('Handling order delivered notification', event);
            addNotification(
                event.detail.message,
                event.detail.orderCode,
                event.detail.clientName,
                event.detail.deliveryMan,
                true,
                false
            );
        };

        const handlePaymentConfirmed = (event: CustomEvent) => {
            console.log('Handling payment confirmed notification', event);
            addNotification(
                event.detail.message,
                event.detail.orderCode,
                event.detail.clientName,
                null,
                false,
                true,
                event.detail.amount,
                event.detail.paymentType
            );
        };

        window.addEventListener('new-order', handleNewOrder as EventListener);
        window.addEventListener('order-delivered', handleOrderDelivered as EventListener);
        window.addEventListener('order-payment-confirmed', handlePaymentConfirmed as EventListener);

        return () => {
            window.removeEventListener('new-order', handleNewOrder as EventListener);
            window.removeEventListener('order-delivered', handleOrderDelivered as EventListener);
            window.removeEventListener('order-payment-confirmed', handlePaymentConfirmed as EventListener);
        };
    }, []);

    const removeNotification = (id: string) => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
    };

    return (
        <Container>
            {notifications.map((notification) => (
                <AlertContent
                    isDelivery={notification.isDelivery}
                    isPaymentConfirmed={notification.isPaymentConfirmed}
                    key={notification.id}
                >
                    <span className="message-title">{notification.message}</span>
                    <span><strong>Código do pedido: </strong>{notification.orderCode}</span>
                    {notification.isDelivery && notification.deliveryMan && (
                        <span><strong>Motoboy: </strong>{notification.deliveryMan}</span>
                    )}
                    {notification.isPaymentConfirmed && notification.amount && (
                        <span><strong>Valor: </strong>R$ {notification.amount.toFixed(2)}</span>
                    )}
                    {notification.isPaymentConfirmed && notification.paymentType && (
                        <span><strong>Método: </strong>{notification.paymentType}</span>
                    )}
                    <span><strong>Cliente: </strong>{notification.clientName}</span>
                    <button
                        onClick={() => removeNotification(notification.id)}
                    >
                        ×
                    </button>
                </AlertContent>
            ))}
        </Container>
    );
};
