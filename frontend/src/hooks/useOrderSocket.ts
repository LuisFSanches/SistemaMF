import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { PUBLIC_ROUTES } from '../constants';
import { checkPublicRoute } from '../utils';

const baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:3334';

type OrderEventType =
    | 'whatsappOrder'
    | 'storeFrontOrder'
    | 'orderDelivered'
    | 'orderPaymentConfirmed';

export const useOrderSocket = (
    onOrderReceived: (data: any, eventType: OrderEventType) => void,
    storeId?: string
) => {
    const socketRef = useRef<Socket | null>(null);
    const storeIdRef = useRef<string | undefined>(storeId);
    const callbackRef = useRef(onOrderReceived);

    // Mantém callback sempre atualizado sem recriar listeners
    useEffect(() => {
        callbackRef.current = onOrderReceived;
    }, [onOrderReceived]);

    // Mantém storeId sincronizado
    useEffect(() => {
        storeIdRef.current = storeId;
    }, [storeId]);

    useEffect(() => {
        const currentPath = window.location.pathname;
        const isPublicRoute = checkPublicRoute(currentPath, PUBLIC_ROUTES);

        if (isPublicRoute || !storeId) return;

        // Se já existe socket, não recria
        if (socketRef.current) return;

        console.log('[Socket] Inicializando conexão...');

        const socket = io(baseUrl, {
        transports: ['websocket'],
        reconnection: true,
        reconnectionAttempts: Infinity,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        });

        socketRef.current = socket;

        const joinCurrentStore = () => {
        const currentStoreId = storeIdRef.current;
        if (currentStoreId) {
            socket.emit('joinStore', currentStoreId);
            console.log(`[Socket] Entrou na room store_${currentStoreId}`);
        }
        };

        socket.on('connect', () => {
        console.log('[Socket] Conectado:', socket.id);
        joinCurrentStore();
        });

        socket.io.on('reconnect', () => {
        console.log('[Socket] Reconectado');
        joinCurrentStore();
        });

        // ===== LISTENERS =====

        socket.on('whatsappOrderReceived', (data) => {
        callbackRef.current(data, 'whatsappOrder');
        });

        socket.on('storeFrontOrderReceived', (data) => {
        callbackRef.current(data, 'storeFrontOrder');
        });

        socket.on('orderDelivered', (data) => {
        callbackRef.current(data, 'orderDelivered');
        });

        socket.on('orderPaymentConfirmed', (data) => {
        callbackRef.current(data, 'orderPaymentConfirmed');
        });

        socket.on('disconnect', (reason) => {
        console.log('[Socket] Desconectado:', reason);
        });

        // Cleanup ao desmontar
        return () => {
        console.log('[Socket] Encerrando conexão...');
        socket.disconnect();
        socketRef.current = null;
        };
    }, [storeId]);
};
