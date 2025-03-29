import { useEffect } from 'react';
import { io } from 'socket.io-client';

const baseUrl = process.env.REACT_APP_API_URL || "http://localhost:3334";

const socket = io(baseUrl, {
    transports: ['websocket'], 
});

export const useOrderSocket = (onOrderReceived: (data: any) => void) => {
    useEffect(() => {
        try {
            socket.on('connect', () => {
                console.log('🔌 Conectado ao WebSocket:', socket.id);
            });
    
            socket.on('onlineOrderReceived', (data) => {
                console.log('📦 Novo pedido recebido!', data);
                onOrderReceived(data);
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
