import express from 'express';
import http from 'http';
import 'express-async-errors';
import cors from 'cors';
import dotenv from 'dotenv';
import { orderEmitter, OrderEvents } from './events/orderEvents';

import { Server } from 'socket.io';

dotenv.config();

import { router } from './routes';
import { errorMiddleware } from './middlewares/errors';

orderEmitter.on(OrderEvents.OnlineOrderReceived, (data) => {
  io.emit(OrderEvents.OnlineOrderReceived, data);
});

const app = express();
// const httpsOptions = getCertificatesForWebhook() as any;

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
}));

app.use(express.json());

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

io.on('connection', (socket) => {});
