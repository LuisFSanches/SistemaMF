import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

const baseUrl = process.env.REACT_APP_API_URL || "http://localhost:3334";

export const useOrderSocket = (
    onOrderReceived: (data: any, eventType: string) => void
) => {
    const socketRef = useRef<Socket | null>(null);

    useEffect(() => {
        socketRef.current = io(baseUrl, {
            transports: ['websocket'],
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
        });

        const socket = socketRef.current;

        socket.on('connect', () => {
            console.log('WS conectado:', socket.id);
        });

        socket.on('whatsappOrderReceived', (data) => {
            onOrderReceived(data, 'whatsappOrder');
        });

        socket.on('storeFrontOrderReceived', (data) => {
            onOrderReceived(data, 'storeFrontOrder');
        });

        socket.on('orderDelivered', (data) => {
            onOrderReceived(data, 'orderDelivered');
        });

        return () => {
            socket.removeAllListeners();
            socket.disconnect();
        };
    }, [onOrderReceived]);
};
