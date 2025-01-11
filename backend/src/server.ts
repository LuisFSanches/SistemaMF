import express from 'express';
import http from 'http';
import https from 'https';
import 'express-async-errors';
import cors from 'cors';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';

import { getCertificatesForWebhook } from './utils/getCertificates';

dotenv.config();

import { router } from './routes';
import { errorMiddleware } from './middlewares/errors';

const app = express();
const httpsOptions = getCertificatesForWebhook() as any;

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 120,
  message: {
    error: "Too many requests, please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(limiter);

app.use(express.json());
app.use(cors());
app.use(router);

app.use(errorMiddleware);

const PORT = 3333;
const TIMEOUT = 6000;

const httpsServer = https.createServer(httpsOptions, app).listen(PORT, () => {
  console.log(`Servidor rodando em https://localhost:${PORT}`);
});
httpsServer.setTimeout(TIMEOUT);

if (process.env.IS_PRODUCTION === 'false') {
  const httpServer = http.createServer(app).listen(3334, () => {
    console.log(`Servidor rodando em http://localhost:3334`);
  });
  httpServer.setTimeout(TIMEOUT);
}