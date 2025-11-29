import { useEffect, useState } from 'react';
import { Container, AlertContent } from './style';

type Notification = {
    id: string;
    message: string;
    orderCode: string;
    clientName: string;
    deliveryMan?: string| null;
    isDelivery?: boolean;
};

// Função para tocar som de notificação de novo pedido
const playNotificationSound = () => {
    try {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
    oscillator.frequency.setValueAtTime(1000, audioContext.currentTime + 0.1);
    gainNode.gain.setValueAtTime(0.8, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.8);

    } catch (error) {
        console.error('Erro ao reproduzir som de notificação:', error);
    }
};

// Função para tocar som de notificação de pedido entregue (som diferente)
const playDeliverySound = () => {
    try {
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        // Som mais grave e melódico para entrega
        oscillator.frequency.setValueAtTime(400, audioContext.currentTime);
        oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.15);
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime + 0.3);
        gainNode.gain.setValueAtTime(1.0, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.6);
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 1);

    } catch (error) {
        console.error('Erro ao reproduzir som de entrega:', error);
    }
};

export const OrderNotification = () => {
    const [notifications, setNotifications] = useState<Notification[]>([]);

    const addNotification = (
        message: string,
        orderCode: string,
        clientName: string,
        deliveryMan: string | null = null,
        isDelivery: boolean = false
    ) => {
        const id = crypto.randomUUID();
        const newNotification = { id, message, orderCode, clientName, deliveryMan, isDelivery };
        setNotifications((prev) => [...prev, newNotification]);

        // Tocar som apropriado
        if (isDelivery) {
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
                true
            );
        };

        window.addEventListener('new-order', handleNewOrder as EventListener);
        window.addEventListener('order-delivered', handleOrderDelivered as EventListener);

        return () => {
            window.removeEventListener('new-order', handleNewOrder as EventListener);
            window.removeEventListener('order-delivered', handleOrderDelivered as EventListener);
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
                    key={notification.id}
                >
                    <span className="message-title">{notification.message}</span>
                    <span><strong>Código do pedido: </strong>{notification.orderCode}</span>
                    {notification.isDelivery && notification.deliveryMan && (
                        <span><strong>Motoboy: </strong>{notification.deliveryMan}</span>
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
