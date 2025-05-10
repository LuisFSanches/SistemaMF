import express from 'express';
import http from 'http';
import https from 'https';
import 'express-async-errors';
import cors from 'cors';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import { orderEmitter, OrderEvents } from './events/orderEvents';

import { Server } from 'socket.io';
import { getCertificatesForWebhook } from './utils/getCertificates';

dotenv.config();

import { router } from './routes';
import { errorMiddleware } from './middlewares/errors';

orderEmitter.on(OrderEvents.OnlineOrderReceived, (data) => {
  io.emit(OrderEvents.OnlineOrderReceived, data);
});

const app = express();
const httpsOptions = getCertificatesForWebhook() as any;

app.use(express.json());
app.use(cors());
app.use(router);
app.use(errorMiddleware);

const PORT = 3333;
const TIMEOUT = 6000;
const isProduction = process.env.IS_PRODUCTION === 'true';

const httpsServer = https.createServer(httpsOptions, app);

let server;

if (isProduction) {
  server = httpsServer;
} else {
  server = http.createServer(app).listen(3334, () => {
    console.log(`Servidor rodando em http://localhost:3334`);
  });
  server.setTimeout(TIMEOUT);
}

export const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

io.on('connection', (socket) => {});

httpsServer.listen(PORT, () => {
  console.log(`Servidor rodando em https://localhost:${PORT}`);
});

httpsServer.setTimeout(TIMEOUT);
