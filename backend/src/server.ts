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

orderEmitter.on(OrderEvents.WhatsappOrderReceived, (data) => {
  io.emit(OrderEvents.WhatsappOrderReceived, data);

});

orderEmitter.on(OrderEvents.StoreFrontOderReceived, (data) => {
  io.emit(OrderEvents.StoreFrontOderReceived, data);
});

orderEmitter.on(OrderEvents.orderDelivered, (data) => {
  io.emit(OrderEvents.orderDelivered, data);
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

  socket.on('disconnect', () => {
  });
});
