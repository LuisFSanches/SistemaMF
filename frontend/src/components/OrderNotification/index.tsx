import { useEffect, useState } from 'react';
import { Container, AlertContent } from './style';

type Notification = {
    id: string;
    message: string;
    orderCode: string;
    clientName: string;
};

// Função para tocar som de notificação
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

export const OrderNotification = () => {
    const [notifications, setNotifications] = useState<Notification[]>([]);

    const addNotification = (message: string, orderCode: string, clientName: string) => {
        const id = crypto.randomUUID();
        const newNotification = { id, message, orderCode, clientName };

        setNotifications((prev) => [...prev, newNotification]);

        // Tocar som de notificação
        playNotificationSound();

        setTimeout(() => {
            setNotifications((prev) => prev.filter((n) => n.id !== id));
        }, 25000);
    };

    useEffect(() => {
        const handleNewOrder = (event: CustomEvent) => {
            addNotification(event.detail.message, event.detail.orderCode, event.detail.clientName);
        };

        window.addEventListener('new-order', handleNewOrder as EventListener);

        return () => {
            window.removeEventListener('new-order', handleNewOrder as EventListener);
        };
    }, []);

    const removeNotification = (id: string) => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
    };

    return (
        <Container>
            {notifications.map((notification) => (
                <AlertContent
                    key={notification.id}
                >
                    <span className="message-title">{notification.message}</span>
                    <span><strong>Código do pedido: </strong>{notification.orderCode}</span>
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
