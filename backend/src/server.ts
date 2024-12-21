import express from 'express';
import 'express-async-errors';
import cors from 'cors';
import dotenv from 'dotenv';
import { Server } from 'socket.io';
import { createServer } from 'https';
import { eventEmitter } from './controllers/inter/WebhookPixController';
// import { orderEmitter } from './controllers/order/UpdateOrderController';
import { getCertificatesForWebhook } from './utils/getCertificates';

dotenv.config();

import { router } from './routes';
import { errorMiddleware } from './middlewares/errors';

const app = express();
const httpsOptions = getCertificatesForWebhook() as any;
const httpServer = createServer(httpsOptions, app);
const io = new Server(httpServer, {
  cors: {
      origin: "*",
      methods: ["GET", "POST"],
  },
  transports: ["websocket"],
});

io.on("connection", (socket) => {
  console.log("Cliente conectado ao WebSocket!");

  socket.on("disconnect", () => {
    console.log("Cliente desconectado do WebSocket.");
  });
});

app.use(express.json());
app.use(cors());
app.use(router);

eventEmitter.on("pixReceived", (data) => {
  console.log("Pix Recebido");
  io.emit("pixPaymentNotification", data); // Envia o evento para todos os clientes conectados
});

/*orderEmitter.on("orderUpdated", (data) => {
  console.log("Evento recebido: orderUpdated");
  io.emit("orderUpdateNotification", data); // Envia o evento para todos os clientes conectados
});*/

app.use(errorMiddleware);

// Substituir app.listen por httpServer.listen
httpServer.listen(3333, () => {
  console.log('Servidor rodando na porta 3333!!!!');
});
