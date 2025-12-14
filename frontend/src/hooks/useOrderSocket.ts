import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { PUBLIC_ROUTES } from '../constants';
import { checkPublicRoute } from '../utils';

const baseUrl = process.env.REACT_APP_API_URL || "http://localhost:3334";

// Singleton: mantém uma única instância do socket para toda a aplicação
let globalSocket: Socket | null = null;
let isSocketInitialized = false;

export const useOrderSocket = (
    onOrderReceived: (data: any, eventType: string) => void
) => {
    const callbackRef = useRef(onOrderReceived);

    useEffect(() => {
        callbackRef.current = onOrderReceived;
    }, [onOrderReceived]);

    useEffect(() => {
        const currentPath = window.location.pathname;
        const isPublicRoute = checkPublicRoute(currentPath, PUBLIC_ROUTES);

        if (isPublicRoute) {
            return;
        }

        if (isSocketInitialized && globalSocket) {
            
            globalSocket.off('whatsappOrderReceived');
            globalSocket.off('storeFrontOrderReceived');
            globalSocket.off('orderDelivered');

            globalSocket.on('whatsappOrderReceived', (data) => {
                callbackRef.current(data, 'whatsappOrder');
            });

            globalSocket.on('storeFrontOrderReceived', (data) => {
                callbackRef.current(data, 'storeFrontOrder');
            });

            globalSocket.on('orderDelivered', (data) => {
                callbackRef.current(data, 'orderDelivered');
            });

            return;
        }

        console.log('Inicializando WebSocket pela primeira vez...');
        globalSocket = io(baseUrl, {
            transports: ['websocket'],
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
        });

        isSocketInitialized = true;

        globalSocket.on('connect', () => {
            console.log('WS conectado:', globalSocket?.id);
        });

        globalSocket.on('whatsappOrderReceived', (data) => {
            callbackRef.current(data, 'whatsappOrder');
        });

        globalSocket.on('storeFrontOrderReceived', (data) => {
            callbackRef.current(data, 'storeFrontOrder');
        });

        globalSocket.on('orderDelivered', (data) => {
            callbackRef.current(data, 'orderDelivered');
        });

        return () => {
        };
    }, []);
};
