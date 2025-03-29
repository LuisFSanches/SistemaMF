import { useEffect, useState } from 'react';
import { Container, AlertContent } from './style';

type Notification = {
    id: string;
    message: string;
    orderCode: string;
    clientName: string;
};

export const OrderNotification = () => {
    const [notifications, setNotifications] = useState<Notification[]>([]);

    const addNotification = (message: string, orderCode: string, clientName: string) => {
        const id = crypto.randomUUID();
        const newNotification = { id, message, orderCode, clientName };

        setNotifications((prev) => [...prev, newNotification]);

        setTimeout(() => {
            setNotifications((prev) => prev.filter((n) => n.id !== id));
        }, 350000);
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
