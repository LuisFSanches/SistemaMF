import { useEffect } from 'react';
import { io } from 'socket.io-client';
import { PUBLIC_ROUTES } from '../constants';

const baseUrl = process.env.REACT_APP_API_URL || "http://localhost:3334";

const socket = io(baseUrl, {
    transports: ['websocket'], 
    autoConnect: false,
});

export const useOrderSocket = (onOrderReceived: (data: any, eventType: string) => void) => {
    useEffect(() => {
        const currentPath = window.location.pathname;
        const isPublicRoute = PUBLIC_ROUTES.some(route => {
            if (route === '/') {
                return currentPath === '/';
            }
            return currentPath.includes(route);
        });

        if (isPublicRoute) {
            socket.disconnect();
            return;
        }

        try {
            socket.connect();

            socket.on('connect', () => {});
    
            socket.on('whatsappOrderReceived', (data) => {
                onOrderReceived(data, 'whatsappOrder');
            });

            socket.on('storeFrontOrderReceived', (data) => {
                onOrderReceived(data, 'storeFrontOrder');
            });

            socket.on('orderDelivered', (data) => {
                onOrderReceived(data, 'orderDelivered');
            });
        } catch (error) {
            console.error('Erro ao conectar ao WebSocket:', error);
        }

        return () => {
            socket.disconnect();
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
};
