import express from 'express';
import http from 'http';
import 'express-async-errors';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { orderEmitter, OrderEvents } from './events/orderEvents';

import { Server } from 'socket.io';

dotenv.config();

import { router } from './routes';
import { errorMiddleware } from './middlewares/errors';

// Eventos agora emitem para rooms específicas por store_id
orderEmitter.on(OrderEvents.WhatsappOrderReceived, (data) => {
  const storeId = data?.store_id;
  if (storeId) {
    io.to(`store_${storeId}`).emit(OrderEvents.WhatsappOrderReceived, data);
  } else {
    // Fallback: broadcast global se não houver store_id
    io.emit(OrderEvents.WhatsappOrderReceived, data);
  }
});

orderEmitter.on(OrderEvents.StoreFrontOderReceived, (data) => {
  const storeId = data?.store_id;
  if (storeId) {
    io.to(`store_${storeId}`).emit(OrderEvents.StoreFrontOderReceived, data);
  } else {
    io.emit(OrderEvents.StoreFrontOderReceived, data);
  }
});

orderEmitter.on(OrderEvents.orderDelivered, (data) => {
  const storeId = data?.order?.store_id;
  if (storeId) {
    io.to(`store_${storeId}`).emit(OrderEvents.orderDelivered, data);
  } else {
    io.emit(OrderEvents.orderDelivered, data);
  }
});

orderEmitter.on(OrderEvents.OrderPaymentConfirmed, (data) => {
  const storeId = data?.store_id;
  if (storeId) {
    io.to(`store_${storeId}`).emit(OrderEvents.OrderPaymentConfirmed, data);
  } else {
    io.emit(OrderEvents.OrderPaymentConfirmed, data);
  }
});

const app = express();

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
}));

app.use(express.json());

// Servir uploads localmente apenas se não estiver usando R2
if (process.env.USE_R2_STORAGE !== 'true') {
  app.use('/uploads', express.static(path.resolve(__dirname, '..', 'uploads')));
  console.log('[Server] Serving uploads from local filesystem');
} else {
  console.log('[Server] Using Cloudflare R2 for file storage');
}

app.use(router);
app.use(errorMiddleware);

const PORT = 3333;
const isProduction = process.env.IS_PRODUCTION === 'true';

let server;

if (isProduction) {
  server = http.createServer(app).listen(PORT, () => {
    console.log(`Servidor rodando em https://localhost:${PORT}`);
  });
} else {
  server = http.createServer(app).listen(3334, () => {
    console.log(`Servidor rodando em http://localhost:3334`);
  });
}

export const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  },
});

io.on('connection', (socket) => {
  console.log(`[Socket] Cliente conectado: ${socket.id}`);

  // Cliente deve enviar o store_id para entrar na room correta
  socket.on('joinStore', (storeId: string) => {
    if (storeId) {
      const roomName = `store_${storeId}`;
      socket.join(roomName);
      console.log(`[Socket] Cliente ${socket.id} entrou na room: ${roomName}`);
    }
  });

  // Permite sair de uma room específica
  socket.on('leaveStore', (storeId: string) => {
    if (storeId) {
      const roomName = `store_${storeId}`;
      socket.leave(roomName);
      console.log(`[Socket] Cliente ${socket.id} saiu da room: ${roomName}`);
    }
  });

  socket.on('disconnect', () => {
    console.log(`[Socket] Cliente desconectado: ${socket.id}`);
  });
});
