import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { PUBLIC_ROUTES } from '../constants';
import { checkPublicRoute } from '../utils';

const baseUrl = process.env.REACT_APP_API_URL || "http://localhost:3334";

let globalSocket: Socket | null = null;
let isSocketInitialized = false;
let currentStoreId: string | null = null;

export const useOrderSocket = (
    onOrderReceived: (data: any, eventType: string) => void,
    storeId?: string // 👈 Novo parâmetro
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

        // Se já existe socket mas mudou de store, sair da room anterior e entrar na nova
        if (isSocketInitialized && globalSocket) {
            if (currentStoreId && currentStoreId !== storeId) {
                globalSocket.emit('leaveStore', currentStoreId);
            }
            
            if (storeId && storeId !== currentStoreId) {
                globalSocket.emit('joinStore', storeId);
                currentStoreId = storeId;
            }
            
            globalSocket.off('whatsappOrderReceived');
            globalSocket.off('storeFrontOrderReceived');
            globalSocket.off('orderDelivered');
            globalSocket.off('orderPaymentConfirmed');

            globalSocket.on('whatsappOrderReceived', (data) => {
                callbackRef.current(data, 'whatsappOrder');
            });

            globalSocket.on('storeFrontOrderReceived', (data) => {
                callbackRef.current(data, 'storeFrontOrder');
            });

            globalSocket.on('orderDelivered', (data) => {
                callbackRef.current(data, 'orderDelivered');
            });

            globalSocket.on('orderPaymentConfirmed', (data) => {
                callbackRef.current(data, 'orderPaymentConfirmed');
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
            
            // 👈 Entrar na room da loja ao conectar
            if (storeId) {
                globalSocket?.emit('joinStore', storeId);
                currentStoreId = storeId;
                console.log(`WS entrou na room: store_${storeId}`);
            }
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

        globalSocket.on('orderPaymentConfirmed', (data) => {
            callbackRef.current(data, 'orderPaymentConfirmed');
        });

        return () => {
        };
    }, [storeId]); // 👈 Adicionar storeId como dependência
};