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

// app.use('/uploads', express.static(path.resolve(__dirname, '..', 'uploads')));

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
  console.log('Novo cliente conectado:', socket.id);

  socket.on('disconnect', () => {
    console.log('WS desconectado:', socket.id);
  });
});
